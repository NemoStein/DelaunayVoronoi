import Point from './Point.js'
import Site from './Site.js'

export default class Edge
{
	/**
	 * @param {Site} a One end of the Edge
	 * @param {Site} b The other end
	 */
	constructor(a, b)
	{
		this.a = a
		this.b = b

		this.id = a.id + b.id

		this.length = Point.distance(a, b)

		this.center = new Point(
			(b.x - a.x) / 2 + a.x,
			(b.y - a.y) / 2 + a.y,
		)
	}

	/**
	 * @param {Site} site 
	 * 
	 * @returns {Boolean} If this Edge have this point in any of its ends
	 */
	has(site)
	{
		return (site === this.a || site === this.b)
	}
}
