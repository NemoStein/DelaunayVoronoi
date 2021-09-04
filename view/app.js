import { Delaunay } from '../src/Delaunay.js'
import { GraphRenderer } from './GraphRenderer.js'

const options = {
  drawSites: true,
  drawEdges: true,
  drawCells: true,
  drawCircumcircles: true,
  drawCircumcenter: true,
  drawVoronoi: true
}

/** @type {HTMLCanvasElement} */
const canvas = (document.getElementById('Canvas'))
const renderer = new GraphRenderer(canvas)

const redraw = () => {
  const graph = new Delaunay(points)
  renderer.draw(graph, options)
}

/** @type {import('../src/geom/Point.js').Point[]} */
const points = [
  // 3 Collinear Points
  // { x: 100, y: 300 },
  // { x: 300, y: 300 },
  // { x: 500, y: 300 },
  // { x: 300, y: 100 }

  // Broken Tessellation
  // { x: 264, y: 556 },
  // { x: 423, y: 488 },
  // { x: 597, y: 400 },
  // { x: 665, y: 370 },
  // { x: 391, y: 375 }

  // { x: 0, y: 25 },
  // { x: 75, y: 50 },
  // { x: 125, y: 0 },
  // { x: 150, y: 100 },
  // { x: 25, y: 150 }

  // { x: 150, y: 150 },
  // { x: 225, y: 250 },
  // { x: 50, y: 50 }
]

/** @type {HTMLElement} */
const optionsElement = (document.getElementById('Options'))
for (const key in options) {
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.checked = options[/** @type {keyof options} */ (key)]
  input.addEventListener('click', () => {
    options[/** @type {keyof options} */ (key)] = input.checked
    redraw()
  })

  const label = document.createElement('label')
  label.append(input)
  label.append(key)

  optionsElement.append(label)
}

canvas.addEventListener('click', event => {
  const newPoint = {
    x: event.clientX,
    y: event.clientY
  }

  if (!points.find(point => point.x === newPoint.x && point.y === newPoint.y)) {
    points.push(newPoint)
    redraw()
  }
})

redraw()
