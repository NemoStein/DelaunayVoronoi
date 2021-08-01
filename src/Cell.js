import { Edge } from './Edge.js'
import { Point } from './Point.js'
import { Site } from './Site.js'

export class Cell {
  /**
   * @param {Edge} ab
   * @param {Edge} bc
   * @param {Edge} ca
   */
  constructor (ab, bc, ca) {
    this.ab = ab
    this.bc = bc
    this.ca = ca

    const a = this.a = ab.a
    const b = this.b = (a === bc.a ? bc.b : bc.a)
    const c = this.c = (b === ca.a ? ca.b : ca.a)

    const d = 2 * (
      a.x * (b.y - c.y) +
      b.x * (c.y - a.y) +
      c.x * (a.y - b.y)
    )

    this.circumcenter = new Point(
      (
        (a.x * a.x + a.y * a.y) * (b.y - c.y) +
        (b.x * b.x + b.y * b.y) * (c.y - a.y) +
        (c.x * c.x + c.y * c.y) * (a.y - b.y)
      ) / d,
      -(
        (a.x * a.x + a.y * a.y) * (b.x - c.x) +
        (b.x * b.x + b.y * b.y) * (c.x - a.x) +
        (c.x * c.x + c.y * c.y) * (a.x - b.x)
      ) / d
    )

    const dab = Point.distance(a, b)
    const dbc = Point.distance(b, c)
    const dca = Point.distance(c, a)

    this.circumradius = (dab * dbc * dca) / Math.sqrt(
      (dab + dbc + dca) *
      (dbc + dca - dab) *
      (dca + dab - dbc) *
      (dab + dbc - dca)
    )

    this.centroid = new Point(
      1 / 3 * (a.x + b.x + c.x),
      1 / 3 * (a.y + b.y + c.y)
    )
  }

  /**
   * @param {Site | Edge} siteOrEdge
   *
   * @returns {boolean} If this Cell have this Site/Edge as one of its vertices/sides
   */
  has (siteOrEdge) {
    if (siteOrEdge instanceof Site) {
      return (siteOrEdge === this.a || siteOrEdge === this.b || siteOrEdge === this.c)
    } else if (siteOrEdge instanceof Edge) {
      return (siteOrEdge === this.ab || siteOrEdge === this.bc || siteOrEdge === this.ca)
    }

    throw new Error('Expected "siteOrEdge" to be of type Site or Edge')
  }
}
