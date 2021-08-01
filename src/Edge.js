import { Point } from './Point.js'

/** @typedef {import('./Site.js').Site} Site */

export class Edge {
  /**
   * @param {Site} a One end of the Edge
   * @param {Site} b The other end
   */
  constructor (a, b) {
    this.a = a
    this.b = b

    this.length = Point.distance(a, b)

    this.center = new Point(
      (b.x - a.x) / 2 + a.x,
      (b.y - a.y) / 2 + a.y
    )
  }

  /**
   * @param {Site} site
   *
   * @returns {boolean} If this Edge have this point in any of its ends
   */
  has (site) {
    return (site === this.a || site === this.b)
  }
}
