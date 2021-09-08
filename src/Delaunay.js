import { Point, Segment, Triangle } from '@sourbit/geom'

export class Delaunay {
  /**
   * @param {Point[]} points
   */
  constructor (points) {
    /** @private */
    this.points = points

    /** @type {Set<Point>} */
    this.sites = new Set()

    /** @type {Set<Segment>} */
    this.edges = new Set()

    /** @type {Set<Triangle>} */
    this.cells = new Set()

    this.triangulate()
  }

  triangulate () {
    const { a, b, c } = insertSuperTriangle(this.sites, this.edges, this.cells)

    for (const point of this.points) {
      const site = new Point(point.x, point.y)
      this.sites.add(site)

      const affectedCells = getAffectedCells(site, this.cells)

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
}

/**
 * @param {Set<Point>} sites
 * @param {Set<Segment>} edges
 * @param {Set<Triangle>} cells
 */
const insertSuperTriangle = (sites, edges, cells) => {
  const n = 2 ** 32
  const step = Math.PI * 2 / 3

  const a = new Point(Math.cos(1 * step) * n, Math.sin(1 * step) * n)
  const b = new Point(Math.cos(2 * step) * n, Math.sin(2 * step) * n)
  const c = new Point(Math.cos(3 * step) * n, Math.sin(3 * step) * n)

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
 */
const getAffectedCells = (site, cells) => {
  /** @type {Triangle[]} */
  const result = []

  for (const cell of cells) {
    const dx = site.x - cell.circumcenter.x
    const dy = site.y - cell.circumcenter.y

    if (dx * dx + dy * dy <= cell.circumradius * cell.circumradius) {
      result.push(cell)
    }
  }

  return result
}
