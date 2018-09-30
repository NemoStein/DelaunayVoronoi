import Site from './Site.js'
import Edge from './Edge.js'
import Cell from './Cell.js'

export default class Delaunay
{
	/**
	 * @param {{x:Number, y:Number}[]} points 
	 */
	constructor(points)
	{
		if (points.length === 0)
		{
			//throw 'Argument "points" must not be empty.'
		}

		this.points = points
		this.triangulate()
	}

	triangulate()
	{
		Site.id = 0

		const box = this.calculateBoundingBox()

		const a = new Site(box.x + box.w / 2, box.y - box.h)
		const b = new Site(box.x + box.w * 1.5, box.y + box.h)
		const c = new Site(box.x - box.w / 2, box.y + box.h)

		const ab = new Edge(a, b)
		const bc = new Edge(b, c)
		const ca = new Edge(c, a)

		const abc = new Cell(ab, bc, ca)

		this.sites = new Set([a, b, c])
		this.edges = new Set([ab, bc, ca])
		this.cells = new Set([abc])

		for (const point of this.points)
		{
			const site = new Site(point.x, point.y)
			const affectedCells = this.getAffectedCells(site)

			const possibleSharedEdges = new Set()
			const sharedEdges = new Set()
			const sharedSites = new Set()
			const newEdges = []

			for (const cell of affectedCells)
			{
				this.cells.delete(cell)

				if (affectedCells.length > 1)
				{
					for (const neighbour of affectedCells)
					{
						if (cell === neighbour)
						{
							continue
						}

						if (neighbour.has(cell.ab))
						{
							this.edges.delete(cell.ab)
						}
						else
						{
							possibleSharedEdges.add(cell.ab)
						}

						if (neighbour.has(cell.bc))
						{
							this.edges.delete(cell.bc)
						}
						else
						{
							possibleSharedEdges.add(cell.bc)
						}

						if (neighbour.has(cell.ca))
						{
							this.edges.delete(cell.ca)
						}
						else
						{
							possibleSharedEdges.add(cell.ca)
						}
					}
				}
				else
				{
					sharedEdges.add(cell.ab)
					sharedEdges.add(cell.bc)
					sharedEdges.add(cell.ca)
				}
			}

			for (const edge of possibleSharedEdges)
			{
				if (this.edges.has(edge))
				{
					sharedEdges.add(edge)
				}
			}

			for (const shared of sharedEdges)
			{
				sharedSites.add(shared.a)
				sharedSites.add(shared.b)
			}

			for (const shared of sharedSites)
			{
				const edge = new Edge(shared, site)

				newEdges.push(edge)
				this.edges.add(edge)
			}

			for (const ab of sharedEdges)
			{
				const bc = newEdges.find(edge =>
				{
					return (ab.a == edge.a || ab.a == edge.b)
				})

				const ca = newEdges.find(edge =>
				{
					if (edge == bc)
					{
						return
					}

					return (ab.b == edge.a || ab.b == edge.b)
				})

				const cell = new Cell(ab, bc, ca)
				this.cells.add(cell)
			}

			this.sites.add(site)
		}

		const removeEdges = new Set()
		const removeCells = new Set()

		for (const edge of this.edges)
		{
			if (edge.a == a || edge.b == a || edge.a == b || edge.b == b || edge.a == c || edge.b == c)
			{
				removeEdges.add(edge)

				for (const cell of this.cells)
				{
					if (cell.ab == edge || cell.bc == edge || cell.ca == edge)
					{
						removeCells.add(cell)
					}
				}
			}
		}
	}

	/**
	 * @param {Site} site 
	 * 
	 * @returns {Cell[]}
	 */
	getAffectedCells(site)
	{
		/** @type {Cell[]} */
		const result = []

		for (const cell of this.cells)
		{
			const dx = site.x - cell.circumcenter.x
			const dy = site.y - cell.circumcenter.y

			if (dx * dx + dy * dy <= cell.circumradius * cell.circumradius)
			{
				result.push(cell)
			}
		}

		return result
	}

	calculateBoundingBox()
	{
		if (this.points.length === 0)
		{
			return {
				x1: 0,
				x2: 0,
				y1: 0,
				y2: 0,
			}
		}

		const box = {
			x1: this.points[0].x,
			x2: this.points[0].x,
			y1: this.points[0].y,
			y2: this.points[0].y,
		}

		for (const point of this.points)
		{
			box.x1 = (box.x1 > point.x ? point.x : box.x1)
			box.x2 = (box.x2 < point.x ? point.x : box.x2)
			box.y1 = (box.y1 > point.y ? point.y : box.y1)
			box.y2 = (box.y2 < point.y ? point.y : box.y2)
		}

		box.x = box.x1 - 10
		box.y = box.y1 - 10
		box.w = box.x2 - box.x1 + 20
		box.h = box.y2 - box.y1 + 20

		return box
	}
}
