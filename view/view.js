import { Delaunay } from '../src/Delaunay.js'

/** @type {HTMLCanvasElement} */
const canvas = (document.getElementById('Canvas'))

/** @type {CanvasRenderingContext2D} */
const context = (canvas.getContext('2d'))

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

const offsetX = 200
const offsetY = 200

/** @type {import('../src/Delaunay.js').Point[]} */
const originalPoints = []

// const originalPoints =
// [
//   {x:   0, y:  25},
//   {x:  75, y:  50},
//   {x: 125, y:   0},
//   {x: 150, y: 100},
//   {x:  25, y: 150},
// ]

// const originalPoints =
// [
//   {x:  150, y:  150},
//   {x:  225, y:  250},
//   {x:  50, y:  50},
// ]

// const originalPoints =
// [
//   {x:  80, y: 110},
//   {x: 312, y: 118},
//   {x:  72, y: -63},
//   {x: 232, y: -12},
// ]

// const originalPoints =
// [
//   {x: 100, y: 100},
//   {x: 110, y: 100},
//   {x: 120, y: 100},
//   {x: 110, y: 130},
// ]

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

  graph.cells.forEach(function (cell) {
    if (options.drawCells) {
      context.beginPath()

      if (options.grayScale) {
        const alpha = (cell.circumcenter.x + cell.circumcenter.y) / 100 % 1
        context.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4 + 0.1})`
      } else {
        context.fillStyle = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`
      }
      context.moveTo(cell.a.x + offsetX, cell.a.y + offsetY)
      context.lineTo(cell.b.x + offsetX, cell.b.y + offsetY)
      context.lineTo(cell.c.x + offsetX, cell.c.y + offsetY)
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

      context.arc(cell.circumcenter.x + offsetX, cell.circumcenter.y + offsetY, cell.circumradius, 0, Math.PI * 2)
      context.stroke()
    }

    if (options.drawCircumcenter) {
      context.beginPath()
      context.fillStyle = 'blue'
      context.fillRect(cell.circumcenter.x + offsetX - 3, cell.circumcenter.y + offsetY - 3, 6, 6)
      context.fill()
    }
  })

  if (options.drawEdges) {
    graph.edges.forEach(function (edge) {
      context.beginPath()
      context.lineWidth = 1.5

      if (options.grayScale) {
        context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
      } else {
        context.strokeStyle = `rgba(${Math.floor(Math.random() * 170)}, ${Math.floor(Math.random() * 170)}, ${Math.floor(Math.random() * 170)}, 0.75)`
      }

      context.moveTo(edge.a.x + offsetX, edge.a.y + offsetY)
      context.lineTo(edge.b.x + offsetX, edge.b.y + offsetY)
      context.stroke()
    })
  }

  if (options.drawSites) {
    graph.sites.forEach(function (site) {
      context.beginPath()
      context.fillStyle = 'red'
      context.fillRect(site.x + offsetX - 3, site.y + offsetY - 3, 6, 6)
      context.fill()
    })
  }
}

let total = originalPoints.length + 1
document.addEventListener('click', function () {
  const points = []

  for (let i = 0; i < originalPoints.length; i++) {
    if (i < total) {
      points.push(originalPoints[i])
    }
  }

  draw(new Delaunay(points))

  total++
})

canvas.addEventListener('click', function (event) {
  const point = {
    x: event.clientX - offsetX,
    y: event.clientY - offsetY
  }

  originalPoints.push(point)
})

draw(new Delaunay(originalPoints))
