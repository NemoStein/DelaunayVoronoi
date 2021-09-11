import { Point, Segment, Triangle } from '@sourbit/geom'

export class Delaunay {
  /**
   * @param {Point[]} points
   */
  constructor (points = []) {
    /** @type {Set<Point>} */
    this.sites = new Set()

    /** @type {Set<Segment>} */
    this.edges = new Set()

    /** @type {Set<Triangle>} */
    this.cells = new Set()

    /** @private @type {Point[]} */
    this.points = []
    for (const point of points) {
      this.addPoint(point)
    }

    this.triangulate()
  }

  triangulate () {
    const { a, b, c } = insertSuperTriangle(this.points, this.sites, this.edges, this.cells)

    for (const site of this.points) {
      const affectedCells = getAffectedCells(site, this.cells, a, b, c)

      /** @type {Set<Segment>} */
      const possibleSharedEdges = new Set()

      /** @type {Set<Segment>} */
      const sharedEdges = new Set()

      /** @type {Set<Point>} */
      const sharedSites = new Set()

      /** @type {Segment[]} */
      const newEdges = []

      for (const cell of affectedCells) {
        this.cells.delete(cell)

        if (affectedCells.length > 1) {
          for (const neighbour of affectedCells) {
            if (cell === neighbour) {
              continue
            }

            if (neighbour.has(cell.ab)) {
              this.edges.delete(cell.ab)
            } else {
              possibleSharedEdges.add(cell.ab)
            }

            if (neighbour.has(cell.bc)) {
              this.edges.delete(cell.bc)
            } else {
              possibleSharedEdges.add(cell.bc)
            }

            if (neighbour.has(cell.ca)) {
              this.edges.delete(cell.ca)
            } else {
              possibleSharedEdges.add(cell.ca)
            }
          }
        } else {
          sharedEdges.add(cell.ab)
          sharedEdges.add(cell.bc)
          sharedEdges.add(cell.ca)
        }
      }

      for (const edge of possibleSharedEdges) {
        if (this.edges.has(edge)) {
          sharedEdges.add(edge)
        }
      }

      for (const shared of sharedEdges) {
        sharedSites.add(shared.a)
        sharedSites.add(shared.b)
      }

      for (const shared of sharedSites) {
        const edge = new Segment(shared, site)

        newEdges.push(edge)
        this.edges.add(edge)
      }

      for (const ab of sharedEdges) {
        /** @type {Segment} */
        const bc = (newEdges.find(edge => edge.has(ab.a)))

        /** @type {Segment} */
        const ca = (newEdges.find(edge => edge !== bc && edge.has(ab.b)))

        const cell = new Triangle(ab, bc, ca)
        this.cells.add(cell)
      }

      this.sites.add(site)
    }

    removeSuperTriangle(a, b, c, this.sites, this.edges, this.cells)
  }

  /**
   * @param {Point} point
   */
  addPoint (point) {
    const site = new Point(point.x, point.y)
    this.points.push(site)
  }

  generateMST () {
    /** @type {Segment[]} */
    const mst = []
    const segments = [...this.edges].sort((a, b) => a.length - b.length)

    /** @type {Map<Point, Point>} */
    const parents = new Map()

    /** @param {Point} site */
    const traverse = site => {
      while (parents.has(site)) site = /** @type {Point} */ (parents.get(site))
      return site
    }

    for (const segment of segments) {
      const a = traverse(segment.a)
      const b = traverse(segment.b)

      if (a !== b) {
        parents.set(a, b)
        mst.push(segment)
      }
    }

    return mst
  }
}

/**
 * @param {Point[]} points
 * @param {Set<Point>} sites
 * @param {Set<Segment>} edges
 * @param {Set<Triangle>} cells
 */
const insertSuperTriangle = (points, sites, edges, cells) => {
  const min = {
    x: Infinity,
    y: Infinity
  }
  const max = {
    x: -Infinity,
    y: -Infinity
  }

  for (const point of points) {
    if (min.x > point.x) min.x = point.x
    if (min.y > point.y) min.y = point.y
    if (max.x < point.x) max.x = point.x
    if (max.y < point.y) max.y = point.y
  }

  const offsetX = (min.x + max.x) / 2
  const offsetY = (min.y + max.y) / 2

  const distance = Point.distance(
    new Point(min.x, min.y),
    new Point(max.x, max.y)
  )

  const step = Math.PI * 2 / 3

  const a = new Point(Math.cos(0 * step) * distance + offsetX, Math.sin(0 * step) * distance + offsetY)
  const b = new Point(Math.cos(1 * step) * distance + offsetX, Math.sin(1 * step) * distance + offsetY)
  const c = new Point(Math.cos(2 * step) * distance + offsetX, Math.sin(2 * step) * distance + offsetY)

  const ab = new Segment(a, b)
  const bc = new Segment(b, c)
  const ca = new Segment(c, a)

  const abc = new Triangle(ab, bc, ca)

  sites.clear()
  edges.clear()
  cells.clear()

  sites.add(a)
  sites.add(b)
  sites.add(c)

  edges.add(ab)
  edges.add(bc)
  edges.add(ca)

  cells.add(abc)

  return { a, b, c }
}

/**
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 * @param {Set<Point>} sites
 * @param {Set<Segment>} edges
 * @param {Set<Triangle>} cells
 */
const removeSuperTriangle = (a, b, c, sites, edges, cells) => {
  const removeEdges = new Set()
  const removeCells = new Set()

  for (const edge of edges) {
    if (edge.has(a) || edge.has(b) || edge.has(c)) {
      removeEdges.add(edge)

      for (const cell of cells) {
        if (cell.has(edge)) {
          removeCells.add(cell)
        }
      }
    }
  }

  sites.delete(a)
  sites.delete(b)
  sites.delete(c)

  for (const edge of removeEdges) {
    edges.delete(edge)
  }

  for (const cell of removeCells) {
    cells.delete(cell)
  }
}

/**
 * @param {Point} site
 * @param {Set<Triangle>} cells
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 */
const getAffectedCells = (site, cells, a, b, c) => {
  /** @type {Triangle[]} */
  const result = []

  for (const cell of cells) {
    const hasA = cell.has(a)
    const hasB = cell.has(b)
    const hasC = cell.has(c)

    let shared = 0

    if (hasA) shared++
    if (hasB) shared++
    if (hasC) shared++

    if (shared === 1) {
      const shared = hasA ? a : hasB ? b : c
      const segment = !cell.ab.has(shared)
        ? cell.ab
        : !cell.bc.has(shared)
            ? cell.bc
            : cell.ca

      const side = Segment.pointSide(segment, site)

      if (cell.winding !== side) {
        result.push(cell)
      }

      continue
    }

    if (shared === 2) {
      const notShared = !hasA ? a : !hasB ? b : c
      const segment = !cell.ab.has(notShared)
        ? cell.ab
        : !cell.bc.has(notShared)
            ? cell.bc
            : cell.ca
      const slope = segment.slope
      const thirdVertex = !segment.has(cell.a) ? cell.a : !segment.has(cell.b) ? cell.b : cell.c

      const slopedSegment = new Segment(thirdVertex, new Point(Math.cos(slope) * 100 + thirdVertex.x, Math.sin(slope) * 100 + thirdVertex.y))
      const side = Segment.pointSide(slopedSegment, site)

      if (cell.winding === side) {
        result.push(cell)
      }

      continue
    }

    const dx = site.x - cell.circumcenter.x
    const dy = site.y - cell.circumcenter.y

    if (dx * dx + dy * dy <= cell.circumradius * cell.circumradius) {
      result.push(cell)
    }
  }

  return result
}
