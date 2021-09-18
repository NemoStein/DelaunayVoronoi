/* global localStorage */

import { Delaunay } from '../src/Delaunay.js'
import { GraphRenderer } from './GraphRenderer.js'

const OPTIONS_STORAGE_KEY = 'graph-options'
const persistedOptions = JSON.parse(localStorage.getItem(OPTIONS_STORAGE_KEY) ?? '{}')

/** @typedef {defaults} DrawOptions */
const defaults = {
  drawSites: true,
  drawEdges: true,
  drawCells: false,
  drawCircumcircles: false,
  drawCircumcenter: false,
  drawVoronoi: false,
  drawMST: false
}

/** @type {DrawOptions} */
const options = Object.assign({}, defaults, persistedOptions)

/** @type {import('@sourbit/geom').Point[]} */
const points = [
  // 3 Collinear Points
  // { x: 200, y: 500 },
  // { x: 600, y: 500 },
  // { x: 1000, y: 500 }
]

/** @type {HTMLCanvasElement} */
const canvas = (document.getElementById('Canvas'))
const renderer = new GraphRenderer(canvas)

const redraw = () => {
  renderer.draw(graph, options)
}

// === Random Points =======================================
let totalPoints = 2000
while (totalPoints-- > 0) {
  points.push({
    x: Math.round(Math.random() * (canvas.width - 50) + 25),
    y: Math.round(Math.random() * (canvas.height - 50) + 25)
  })
}

// console.log(points.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x))
// =========================================================

// === Grid ================================================
// const cols = 20
// const rows = 15

// for (let x = 0; x < cols; x++) {
//   for (let y = 0; y < rows; y++) {
//     points.push({
//       x: x * 50 + 50,
//       y: y * 50 + 50
//     })
//   }
// }
// =========================================================

const graph = new Delaunay(points)
console.log(graph)

/** @type {HTMLElement} */
const optionsElement = (document.getElementById('Options'))
for (const key in options) {
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.checked = options[/** @type {keyof options} */ (key)]
  input.addEventListener('click', () => {
    options[/** @type {keyof options} */ (key)] = input.checked
    localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options))

    redraw()
  })

  const label = document.createElement('label')
  label.append(input)
  label.append(key)

  optionsElement.append(label)
}

canvas.addEventListener('click', event => {
  if (event.ctrlKey) {
    graph.addPoint({
      x: Math.round(event.clientX / 100) * 100,
      y: Math.round(event.clientY / 100) * 100
    })
  } else {
    graph.addPoint({
      x: event.clientX,
      y: event.clientY
    })
  }
  graph.triangulate()

  redraw()
})

window.addEventListener('resize', () => {
  redraw()
})

redraw()
