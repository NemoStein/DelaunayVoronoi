import { Point } from './Point.js'

export class Site extends Point {
  /**
   * @param {number} x Site X position
   * @param {number} y Site Y position
   * @param {boolean} virtual
   */
  constructor (x, y, virtual = false) {
    super(x, y)

    this.virtual = virtual
  }
}
