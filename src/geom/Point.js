export class Point {
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  /**
   * @param {Point} a
   * @param {Point} b
   *
   * @returns {number} Distance between Point A and Point B
   */
  static distance (a, b) {
    return Math.sqrt(Math.abs((b.x - a.x) * (b.x - a.x)) + Math.abs((b.y - a.y) * (b.y - a.y)))
  }

  /**
   * @param {Point} point
   * @param {Point} anchor
   * @param {number} angle
   */
  static rotateAround (point, anchor, angle) {
    const offsetX = point.x - anchor.x
    const offsetY = point.y - anchor.y

    const sin = Math.sin(angle)
    const cos = Math.cos(angle)

    const x = offsetX * cos - offsetY * sin + anchor.x
    const y = offsetX * sin + offsetY * cos + anchor.y

    point.x = x
    point.y = y

    return point
  }

  /**
   * @param {Point} point
   * @param {Point} offset
   */
  static translate (point, offset) {
    point.x += offset.x
    point.y += offset.y

    return point
  }
}
