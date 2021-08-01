import { Point } from './Point.js'

export class Site extends Point {
  /**
   * @param {number} x Site X position
   * @param {number} y Site Y position
   */
  constructor (x, y) {
    super(x, y)

    console.log(x, y)
  }
}
