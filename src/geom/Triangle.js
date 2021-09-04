import { Point } from './Point.js'
import { Segment } from './Segment.js'

export class Triangle {
  /**
   * @param {Segment} ab
   * @param {Segment} bc
   * @param {Segment} ca
   */
  constructor (ab, bc, ca) {
    this.ab = ab
    this.bc = bc
    this.ca = ca

    this.a = ab.a
    this.b = (this.a === bc.a ? bc.b : bc.a)
    this.c = (this.b === ca.a ? ca.b : ca.a)

    this.circumcenter = calculateCircumcenter(this.a, this.b, this.c)
    this.circumradius = calculateCircumradius(this.a, this.b, this.c)
    this.centroid = calculateCentroid(this.a, this.b, this.c)
  }

  /**
   * @param {Point|Segment} pointOrSegment
   *
   * @returns {boolean} If this Triangle have this Point/Segment as one of its vertices/edges
   */
  has (pointOrSegment) {
    if (pointOrSegment instanceof Point) {
      return (pointOrSegment === this.a || pointOrSegment === this.b || pointOrSegment === this.c)
    }

    if (pointOrSegment instanceof Segment) {
      return (pointOrSegment === this.ab || pointOrSegment === this.bc || pointOrSegment === this.ca)
    }

    throw new Error('Expected "pointOrSegment" to be of type Point or Segment')
  }
}

/**
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 */
const calculateCentroid = (a, b, c) => {
  return new Point(
    1 / 3 * (a.x + b.x + c.x),
    1 / 3 * (a.y + b.y + c.y)
  )
}

/**
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 */
const calculateCircumradius = (a, b, c) => {
  const dab = Point.distance(a, b)
  const dbc = Point.distance(b, c)
  const dca = Point.distance(c, a)

  return (dab * dbc * dca) / Math.sqrt(
    (dab + dbc + dca) *
    (dbc + dca - dab) *
    (dca + dab - dbc) *
    (dab + dbc - dca)
  )
}

/**
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 */
const calculateCircumcenter = (a, b, c) => {
  const d = 2 * (
    a.x * (b.y - c.y) +
    b.x * (c.y - a.y) +
    c.x * (a.y - b.y)
  )

  return new Point(
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
}
