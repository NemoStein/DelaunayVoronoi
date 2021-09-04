import { Point } from './Point.js'

export class Segment {
  /**
   * @param {Point} a One end of the line segment
   * @param {Point} b The other end
   */
  constructor (a, b) {
    this.a = a
    this.b = b

    this.length = Point.distance(a, b)
    this.center = calculateCenter(a, b)
    this.slope = calculateSlope(a, b)
  }

  /**
   * @param {Point} point
   *
   * @returns {boolean} If this line segment have this point in any of its ends
   */
  has (point) {
    return (point === this.a || point === this.b)
  }
}

/**
 * @param {Point} a
 * @param {Point} b
 */
const calculateCenter = (a, b) => {
  return new Point(
    (b.x - a.x) / 2 + a.x,
    (b.y - a.y) / 2 + a.y
  )
}

/**
 * @param {Point} a
 * @param {Point} b
 */
const calculateSlope = (a, b) => {
  return Math.atan2(b.y - a.y, b.x - a.x)
}
