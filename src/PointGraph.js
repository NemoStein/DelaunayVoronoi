import { Point } from '@sourbit/geom'
import { Delaunay } from './Delaunay.js'
import { Voronoi } from './Voronoi.js'

export class PointGraph {
  /**
   * @param {Point[]} points
   */
  constructor (points = []) {
    this.delaunay = new Delaunay()
    this.voronoi = new Voronoi()

    /** @private @type {Point[]} */
    this.points = []
    for (const point of points) {
      this.addPoint(point)
    }

    this.triangulate()
  }

  /**
   * @param {Point} point
   */
  addPoint (point) {
    const overlaps = this.points.some(pointInSet => point.x === pointInSet.x && point.y === pointInSet.y)
    if (!overlaps) {
      const site = new Point(point.x + Math.random() - 0.5, point.y + Math.random() - 0.5)

      this.points.push(site)
    }
  }

  triangulate () {
    this.delaunay.triangulate(this.points)
  }
}
