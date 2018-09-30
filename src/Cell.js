export default class Cell
{
	constructor(ab, bc, ca)
	{
		this.ab = ab
		this.bc = bc
		this.ca = ca

		const a = this.a = ab.a
		const b = this.b = (a == bc.a ? bc.b : bc.a)
		const c = this.c = (b == ca.a ? ca.b : ca.a)

		this.id = a.id + b.id + c.id

		const d = 2 * (
			a.x * (b.y - c.y) +
			b.x * (c.y - a.y) +
			c.x * (a.y - b.y)
		)

		this.circumcenter = {
			x: (
				(a.x * a.x + a.y * a.y) * (b.y - c.y) +
				(b.x * b.x + b.y * b.y) * (c.y - a.y) +
				(c.x * c.x + c.y * c.y) * (a.y - b.y)
			) / d,

			y: -(
				(a.x * a.x + a.y * a.y) * (b.x - c.x) +
				(b.x * b.x + b.y * b.y) * (c.x - a.x) +
				(c.x * c.x + c.y * c.y) * (a.x - b.x)
			) / d,
		}

		const distance = function(a, b)
		{
			return Math.sqrt(Math.abs((b.x - a.x) * (b.x - a.x)) + Math.abs((b.y - a.y) * (b.y - a.y)))
		}
		const dab = distance(a, b)
		const dbc = distance(b, c)
		const dca = distance(c, a)

		this.circumradius = (dab * dbc * dca) / Math.sqrt(
			(dab + dbc + dca) *
			(dbc + dca - dab) *
			(dca + dab - dbc) *
			(dab + dbc - dca)
		)

		this.centroid = {
			x: 1 / 3 * (a.x + b.x + c.x),
			y: 1 / 3 * (a.y + b.y + c.y),
		}

		this.has = function(siteOrEdge)
		{
			if (siteOrEdge.constructor.name == 'Site')
			{
				return (siteOrEdge == this.a || siteOrEdge == this.b || siteOrEdge == this.c)
			}
			else if (siteOrEdge.constructor.name == 'Edge')
			{
				return (siteOrEdge == this.ab || siteOrEdge == this.bc || siteOrEdge == this.ca)
			}
		}
	}
}
