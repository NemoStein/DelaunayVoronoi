export default class Point
{
	/**
	 * 
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	constructor(x, y)
	{
		this.x = x
		this.y = y
	}

	/**
	 * @param {Point} a 
	 * @param {Point} b 
	 * 
	 * @returns {Number} Distance between Point A and Point B
	 */
	static distance(a, b)
	{
		return Math.sqrt(Math.abs((b.x - a.x) * (b.x - a.x)) + Math.abs((b.y - a.y) * (b.y - a.y)))
	}
}
