import Delaunay from './src/Delaunay.js'

document.addEventListener('DOMContentLoaded', () =>
{
	const canvas = document.getElementById('Canvas')
	if (!(canvas instanceof HTMLCanvasElement))
	{
		return;
	}

	const context = canvas.getContext('2d')

	canvas.width = document.body.clientWidth
	canvas.height = document.body.clientHeight

	const offsetX = 175
	const offsetY = 325

	const originalPoints = []

	// const originalPoints =
	// [
	// 	{x:   0, y:  25},
	// 	{x:  75, y:  50},
	// 	{x: 125, y:   0},
	// 	{x: 150, y: 100},
	// 	{x:  25, y: 150},
	// ]

	// const originalPoints =
	// [
	// 	{x:  150, y:  150},
	// 	{x:  225, y:  250},
	// 	{x:  50, y:  50},
	// ]

	// const originalPoints =
	// [
	// 	{x:  80, y: 110},
	// 	{x: 312, y: 118},
	// 	{x:  72, y: -63},
	// 	{x: 232, y: -12},
	// ]

	// const originalPoints =
	// [
	// 	{x: 100, y: 100},
	// 	{x: 110, y: 100},
	// 	{x: 120, y: 100},
	// 	{x: 110, y: 130},
	// ]

	const drawSites = true
	const drawEdges = true
	const drawCells = true
	const drawCircumcircles = true
	const drawCircumcenter = true
	const drawLabels = true
	const grayScale = true

	const draw = function(graph)
	{
		context.clearRect(0, 0, canvas.width, canvas.height)

		if (drawCells)
		{
			graph.cells.forEach(function(cell)
			{
				context.beginPath()

				if (grayScale)
				{
					context.fillStyle = 'rgba(0, 0, 0, ' + (Math.random() * 0.2 + 0.1) + ')'
				}
				else
				{
					context.fillStyle = 'rgba(' +
						Math.floor(Math.random() * 256) + ', ' +
						Math.floor(Math.random() * 256) + ', ' +
						Math.floor(Math.random() * 256) + ', 0.35)'
				}
				context.moveTo(cell.a.x + offsetX, cell.a.y + offsetY)
				context.lineTo(cell.b.x + offsetX, cell.b.y + offsetY)
				context.lineTo(cell.c.x + offsetX, cell.c.y + offsetY)
				context.fill()

				if (drawCircumcircles)
				{
					context.beginPath()
					context.lineWidth = 1

					if (grayScale)
					{
						context.strokeStyle = 'rgba(0, 0, 0, ' + (Math.random() * 0.2 + 0.1) + ')'
					}
					else
					{
						context.strokeStyle = 'rgba(' +
							Math.floor(Math.random() * 85) + ', ' +
							Math.floor(Math.random() * 85) + ', ' +
							Math.floor(Math.random() * 85) + ', 0.35)'
					}

					context.arc(cell.circumcenter.x + offsetX, cell.circumcenter.y + offsetY, cell.circumradius, 0, Math.PI * 2)
					context.stroke()

					if (drawCircumcenter)
					{
						context.beginPath()
						context.fillStyle = 'blue'
						context.fillRect(cell.circumcenter.x + offsetX - 3, cell.circumcenter.y + offsetY - 3, 6, 6)
						context.fill()
					}
				}

				if (drawLabels)
				{
					context.fillStyle = 'black'
					context.fillText(cell.id, cell.centroid.x + offsetX, cell.centroid.y + offsetY)
				}
			})
		}

		if (drawEdges)
		{
			graph.edges.forEach(function(edge)
			{
				context.beginPath()
				context.lineWidth = 1.5

				if (grayScale)
				{
					context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
				}
				else
				{
					context.strokeStyle = 'rgba(' +
						Math.floor(Math.random() * 170) + ', ' +
						Math.floor(Math.random() * 170) + ', ' +
						Math.floor(Math.random() * 170) + ', 0.75)'
				}

				context.moveTo(edge.a.x + offsetX, edge.a.y + offsetY)
				context.lineTo(edge.b.x + offsetX, edge.b.y + offsetY)
				context.stroke()

				if (drawLabels)
				{
					context.fillStyle = 'black'
					context.fillText(edge.id, edge.center.x + offsetX, edge.center.y + offsetY)
				}
			})
		}

		if (drawSites)
		{
			graph.sites.forEach(function(site)
			{
				context.beginPath()
				context.fillStyle = 'red'
				context.fillRect(site.x + offsetX - 3, site.y + offsetY - 3, 6, 6)
				context.fill()

				if (drawLabels)
				{
					context.fillStyle = 'black'
					context.fillText(site.id, site.x + offsetX + 4, site.y + offsetY + 8)
				}
			})
		}
	}

	let total = originalPoints.length + 1
	document.addEventListener('click', function()
	{
		const points = []

		for (let i = 0; i < originalPoints.length; i++)
		{
			if (i < total)
			{
				points.push(originalPoints[i])
			}
		}

		draw(new Delaunay(points))

		total++
	})

	canvas.addEventListener('click', function(event)
	{
		const point = {
			x: event.clientX - offsetX,
			y: event.clientY - offsetY,
		}

		originalPoints.push(point)
	})

	draw(new Delaunay(originalPoints))
})
