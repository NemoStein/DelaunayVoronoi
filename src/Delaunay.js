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

    if (this.points.length > 0) {
      this.triangulate()
    }
  }

  triangulate () {
    const box = this.calculateBoundingBox()

    const a = new Site(box.x + box.w / 2, box.y - box.h)
    const b = new Site(box.x + box.w * 1.5, box.y + box.h)
    const c = new Site(box.x - box.w / 2, box.y + box.h)

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

    for (const point of this.points) {
      const site = new Site(point.x, point.y)
      const affectedCells = this.getAffectedCells(site)

      const possibleSharedEdges = new Set()
      const sharedEdges = new Set()
      const sharedSites = new Set()
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
        const bc = newEdges.find(edge => ab.a === edge.a || ab.a === edge.b)
        const ca = newEdges.find(edge => edge !== bc && (ab.b === edge.a || ab.b === edge.b))

        if (bc == null || ca == null) {
          throw new Error('Corrupted graph')
        }

        const cell = new Cell(ab, bc, ca)
        this.cells.add(cell)
      }

      this.sites.add(site)
    }

    const removeEdges = new Set()
    const removeCells = new Set()

    for (const edge of this.edges) {
      if (edge.a === a || edge.b === a || edge.a === b || edge.b === b || edge.a === c || edge.b === c) {
        removeEdges.add(edge)

        for (const cell of this.cells) {
          if (cell.ab === edge || cell.bc === edge || cell.ca === edge) {
            removeCells.add(cell)
          }
        }
      }
    }
  }

  /**
   * @param {Site} site
   *
   * @returns {Cell[]}
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

  calculateBoundingBox () {
    const box = {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }

    if (this.points.length > 0) {
      let x1 = this.points[0].x
      let x2 = this.points[0].x
      let y1 = this.points[0].y
      let y2 = this.points[0].y

      for (const point of this.points) {
        x1 = (x1 > point.x ? point.x : x1)
        x2 = (x2 < point.x ? point.x : x2)
        y1 = (y1 > point.y ? point.y : y1)
        y2 = (y2 < point.y ? point.y : y2)
      }

      box.x = x1 - 10
      box.y = y1 - 10
      box.w = x2 - x1 + 20
      box.h = y2 - y1 + 20
    }

    return box
  }
}
