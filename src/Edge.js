export default class Edge
{
	constructor(a, b)
	{
		this.a = a
		this.b = b

		this.id = a.id + b.id

		this.length = Math.sqrt(Math.abs((a.x - b.x) * (a.x - b.x)) + Math.abs((a.y - b.y) * (a.y - b.y)))

		this.center = {
			x: (b.x - a.x) / 2 + a.x,
			y: (b.y - a.y) / 2 + a.y,
		}

		this.has = function(site)
		{
			return (site == this.a || site == this.b)
		}
	}
}
