import { Delaunay } from '../src/Delaunay.js'

/** @type {HTMLCanvasElement} */
const canvas = (document.getElementById('Canvas'))

/** @type {CanvasRenderingContext2D} */
const context = (canvas.getContext('2d'))

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

const options = {
  drawSites: true,
  drawEdges: true,
  drawCells: true,
  drawCircumcircles: true,
  drawCircumcenter: true,
  grayScale: true
}

/** @type {HTMLElement} */
const optionsElement = (document.getElementById('Options'))
for (const key in options) {
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.checked = options[/** @type {keyof options} */ (key)]
  input.addEventListener('click', () => {
    options[/** @type {keyof options} */ (key)] = input.checked
  })

  const label = document.createElement('label')
  label.append(input)
  label.append(key)

  optionsElement.append(label)
}

/**
 * @param {Delaunay} graph
 */
const draw = function (graph) {
  context.clearRect(0, 0, canvas.width, canvas.height)

  for (const cell of graph.cells) {
    if (options.drawCells) {
      context.beginPath()

      if (options.grayScale) {
        const alpha = (cell.circumcenter.x + cell.circumcenter.y) / 100 % 1
        context.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4 + 0.1})`
      } else {
        context.fillStyle = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`
      }
      context.moveTo(cell.a.x, cell.a.y)
      context.lineTo(cell.b.x, cell.b.y)
      context.lineTo(cell.c.x, cell.c.y)
      context.fill()
    }

    if (options.drawCircumcircles) {
      context.beginPath()
      context.lineWidth = 1

      if (options.grayScale) {
        context.strokeStyle = 'rgba(0, 0, 0, 0.2)'
      } else {
        context.strokeStyle = `rgba(${Math.floor(Math.random() * 85)}, ${Math.floor(Math.random() * 85)}, ${Math.floor(Math.random() * 85)}, 0.35)`
      }

      context.arc(cell.circumcenter.x, cell.circumcenter.y, cell.circumradius, 0, Math.PI * 2)
      context.stroke()
    }

    if (options.drawCircumcenter) {
      context.beginPath()
      context.fillStyle = 'blue'
      context.fillRect(cell.circumcenter.x - 3, cell.circumcenter.y - 3, 6, 6)
      context.fill()
    }
  }

  if (options.drawEdges) {
    for (const edge of graph.edges) {
      context.beginPath()
      context.lineWidth = 1.5

      if (options.grayScale) {
        context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
      } else {
        context.strokeStyle = `rgba(${Math.floor(Math.random() * 170)}, ${Math.floor(Math.random() * 170)}, ${Math.floor(Math.random() * 170)}, 0.75)`
      }

      context.moveTo(edge.a.x, edge.a.y)
      context.lineTo(edge.b.x, edge.b.y)
      context.stroke()
    }
  }

  if (options.drawSites) {
    for (const site of graph.sites) {
      context.beginPath()
      context.fillStyle = 'red'
      context.fillRect(site.x - 3, site.y - 3, 6, 6)
      context.fill()
    }
  }
}

/** @type {import('../src/Point.js').Point[]} */
const points = []

// [
//   { x: 0, y: 25 },
//   { x: 75, y: 50 },
//   { x: 125, y: 0 },
//   { x: 150, y: 100 },
//   { x: 25, y: 150 }
// ]

// [
//   { x: 150, y: 150 },
//   { x: 225, y: 250 },
//   { x: 50, y: 50 }
// ]

// [
//   { x: 80, y: 110 },
//   { x: 312, y: 118 },
//   { x: 72, y: -63 },
//   { x: 232, y: -12 }
// ]

// [
//   { x: 100, y: 100 },
//   { x: 110, y: 100 },
//   { x: 120, y: 100 },
//   { x: 110, y: 130 }
// ]

canvas.addEventListener('click', function (event) {
  points.push({
    x: event.clientX,
    y: event.clientY
  })

  draw(new Delaunay(points))
})

draw(new Delaunay(points))
