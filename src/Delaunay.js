import { Point, Segment, Triangle } from '@sourbit/geom'

export class Delaunay {
  /**
   * @param {Point[]} points
   */
  constructor (points) {
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
    const { a, b, c } = this.insertSuperTriangle()

    for (const point of this.points) {
      const site = new Point(point.x, point.y)
      this.sites.add(site)

      const affectedCells = this.getAffectedCells(site)

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

    this.removeSuperTriangle(a, b, c)
  }

  insertSuperTriangle () {
    const n = 2 ** 32
    const step = Math.PI * 2 / 3

    const a = new Point(Math.cos(1 * step) * n, Math.sin(1 * step) * n)
    const b = new Point(Math.cos(2 * step) * n, Math.sin(2 * step) * n)
    const c = new Point(Math.cos(3 * step) * n, Math.sin(3 * step) * n)

    const ab = new Segment(a, b)
    const bc = new Segment(b, c)
    const ca = new Segment(c, a)

    const abc = new Triangle(ab, bc, ca)

    this.sites.clear()
    this.edges.clear()
    this.cells.clear()

    this.sites.add(a)
    this.sites.add(b)
    this.sites.add(c)

    this.edges.add(ab)
    this.edges.add(bc)
    this.edges.add(ca)

    this.cells.add(abc)

    return { a, b, c }
  }

  /**
   * @param {Point} a
   * @param {Point} b
   * @param {Point} c
   */
  removeSuperTriangle (a, b, c) {
    const removeEdges = new Set()
    const removeCells = new Set()

    for (const edge of this.edges) {
      if (edge.has(a) || edge.has(b) || edge.has(c)) {
        removeEdges.add(edge)

        for (const cell of this.cells) {
          if (cell.has(edge)) {
            removeCells.add(cell)
          }
        }
      }
    }

    this.sites.delete(a)
    this.sites.delete(b)
    this.sites.delete(c)

    for (const edge of removeEdges) {
      this.edges.delete(edge)
    }

    for (const cell of removeCells) {
      this.cells.delete(cell)
    }
  }

  /**
   * @param {Point} site
   */
  getAffectedCells (site) {
    /** @type {Triangle[]} */
    const result = []

    for (const cell of this.cells) {
      const dx = site.x - cell.circumcenter.x
      const dy = site.y - cell.circumcenter.y

      if (dx * dx + dy * dy <= cell.circumradius * cell.circumradius) {
        result.push(cell)
      }
    }

    return result
  }
}
