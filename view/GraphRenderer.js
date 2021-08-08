import { Point } from '../src/Point.js'

export class GraphRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor (canvas) {
    this.canvas = canvas

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    /** @type {CanvasRenderingContext2D} */
    this.context = (canvas.getContext('2d'))
  }

  /**
   * @param {import('../src/Delaunay.js').Delaunay} graph
   * @param {any} options
   */
  draw (graph, options) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (const cell of graph.cells) {
      if (options.drawCells) {
        this.context.beginPath()

        if (options.grayScale) {
          const alpha = (cell.circumcenter.x + cell.circumcenter.y) / 100 % 1
          this.context.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4 + 0.1})`
        } else {
          this.context.fillStyle = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.35)`
        }
        this.context.moveTo(cell.a.x, cell.a.y)
        this.context.lineTo(cell.b.x, cell.b.y)
        this.context.lineTo(cell.c.x, cell.c.y)
        this.context.fill()
      }

      if (options.drawCircumcircles) {
        this.context.beginPath()
        this.context.lineWidth = 1

        if (options.grayScale) {
          this.context.strokeStyle = 'rgba(0, 0, 0, 0.2)'
        } else {
          this.context.strokeStyle = `rgba(${Math.floor(Math.random() * 85)}, ${Math.floor(Math.random() * 85)}, ${Math.floor(Math.random() * 85)}, 0.35)`
        }

        this.context.arc(cell.circumcenter.x, cell.circumcenter.y, cell.circumradius, 0, Math.PI * 2)
        this.context.stroke()
      }

      if (options.drawCircumcenter) {
        this.context.beginPath()
        this.context.fillStyle = 'blue'
        this.context.fillRect(cell.circumcenter.x - 3, cell.circumcenter.y - 3, 6, 6)
        this.context.fill()
      }
    }

    if (options.drawEdges) {
      for (const edge of graph.edges) {
        this.context.beginPath()
        this.context.lineWidth = 1.5

        if (options.grayScale) {
          this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
        } else {
          this.context.strokeStyle = `rgba(${Math.floor(Math.random() * 170)}, ${Math.floor(Math.random() * 170)}, ${Math.floor(Math.random() * 170)}, 0.75)`
        }

        this.context.moveTo(edge.a.x, edge.a.y)
        this.context.lineTo(edge.b.x, edge.b.y)
        this.context.stroke()

        const p1 = Point.rotateAround(Point.translate({ x: 0, y: -3 }, edge.center), edge.center, edge.slope)
        const p2 = Point.rotateAround(Point.translate({ x: 9, y: 0 }, edge.center), edge.center, edge.slope)
        const p3 = Point.rotateAround(Point.translate({ x: 0, y: 3 }, edge.center), edge.center, edge.slope)

        this.context.beginPath()
        this.context.fillStyle = 'rgb(255, 0, 255)'
        this.context.moveTo(p1.x, p1.y)
        this.context.lineTo(p2.x, p2.y)
        this.context.lineTo(p3.x, p3.y)
        this.context.fill()
      }
    }

    if (options.drawSites) {
      for (const site of graph.sites) {
        this.context.beginPath()
        this.context.fillStyle = 'red'
        this.context.fillRect(site.x - 3, site.y - 3, 6, 6)
        this.context.fill()
      }
    }
  }
}
