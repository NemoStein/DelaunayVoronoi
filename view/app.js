import { Delaunay } from '../src/Delaunay.js'
import { GraphRenderer } from './GraphRenderer.js'

const options = {
  drawSites: true,
  drawEdges: true,
  drawCells: true,
  drawCircumcircles: true,
  drawCircumcenter: true,
  grayScale: true
}

/** @type {HTMLCanvasElement} */
const canvas = (document.getElementById('Canvas'))
const renderer = new GraphRenderer(canvas)

const redraw = () => renderer.draw(new Delaunay(points), options)

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
  points.push({
    x: event.clientX,
    y: event.clientY
  })

  redraw()
})

redraw()
