import { Cell } from './Cell.js'
import { Edge } from './Edge.js'
import { Site } from './Site.js'

/** @typedef {import('./Point.js').Point} Point */

export class Delaunay {
  /**
   * @param {Point[]} points
   */
  constructor (points) {
    this.points = points

    /** @type {Set<Site>} */
    this.sites = new Set()

    /** @type {Set<Edge>} */
    this.edges = new Set()

    /** @type {Set<Cell>} */
    this.cells = new Set()

    this.triangulate()
  }

  triangulate () {
    const { a, b, c } = this.insertSuperTriangle()

    for (const point of this.points) {
      const site = new Site(point.x, point.y)
      this.sites.add(site)

      const affectedCells = this.getAffectedCells(site)

      /** @type {Set<Edge>} */
      const possibleSharedEdges = new Set()

      /** @type {Set<Edge>} */
      const sharedEdges = new Set()

      /** @type {Set<Site>} */
      const sharedSites = new Set()

      /** @type {Edge[]} */
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
        const edge = new Edge(shared, site)

        newEdges.push(edge)
        this.edges.add(edge)
      }

      for (const ab of sharedEdges) {
        /** @type {Edge} */
        const bc = (newEdges.find(edge => edge.has(ab.a)))

        /** @type {Edge} */
        const ca = (newEdges.find(edge => edge !== bc && edge.has(ab.b)))

        const cell = new Cell(ab, bc, ca)
        this.cells.add(cell)
      }

      this.sites.add(site)
    }

    this.removeSuperTriangle(a, b, c)
  }

  insertSuperTriangle () {
    const n = 2 ** 32
    const step = Math.PI * 2 / 3

    const a = new Site(Math.cos(1 * step) * n, Math.sin(1 * step) * n)
    const b = new Site(Math.cos(2 * step) * n, Math.sin(2 * step) * n)
    const c = new Site(Math.cos(3 * step) * n, Math.sin(3 * step) * n)

    const ab = new Edge(a, b)
    const bc = new Edge(b, c)
    const ca = new Edge(c, a)

    const abc = new Cell(ab, bc, ca)

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
   * @param {Site} a
   * @param {Site} b
   * @param {Site} c
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
   * @param {Site} site
   */
  getAffectedCells (site) {
    /** @type {Cell[]} */
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
