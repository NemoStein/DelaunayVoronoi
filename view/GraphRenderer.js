/** @typedef {import('@sourbit/geom').Triangle} Triangle */

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
   * @param {import('./app.js').DrawOptions} options
   */
  draw (graph, options) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (const cell of graph.cells) {
      if (options.drawCells) {
        this.context.beginPath()

        const alpha = (cell.circumcenter.x + cell.circumcenter.y) / 100 % 1
        this.context.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4 + 0.1})`
        this.context.moveTo(cell.a.x, cell.a.y)
        this.context.lineTo(cell.b.x, cell.b.y)
        this.context.lineTo(cell.c.x, cell.c.y)
        this.context.fill()
      }

      if (options.drawCircumcircles) {
        this.context.beginPath()
        this.context.lineWidth = 1
        this.context.strokeStyle = 'rgba(0, 0, 0, 0.2)'

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
        this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)'

        this.context.moveTo(edge.a.x, edge.a.y)
        this.context.lineTo(edge.b.x, edge.b.y)
        this.context.stroke()
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

    if (options.drawVoronoi) {
      /** @type {Map<Triangle, Triangle[]>} */
      const neighbourhood = new Map()
      for (const cell of graph.cells) {
        const neighbours = []
        for (const neighbour of graph.cells) {
          if (cell !== neighbour) {
            if (neighbour.has(cell.ab) || neighbour.has(cell.bc) || neighbour.has(cell.ca)) {
              neighbours.push(neighbour)
            }
          }
        }
        neighbourhood.set(cell, neighbours)
      }

      this.context.beginPath()
      this.context.lineWidth = 1
      this.context.strokeStyle = 'rgba(0, 255, 0, 0.5)'
      for (const [cell, neighbours] of neighbourhood) {
        for (const neighbor of neighbours) {
          this.context.moveTo(cell.circumcenter.x, cell.circumcenter.y)
          this.context.lineTo(neighbor.circumcenter.x, neighbor.circumcenter.y)
          this.context.stroke()
        }
      }
    }

    if (options.drawMST) {
      const msp = graph.generateMSP()

      this.context.beginPath()
      this.context.lineWidth = 4
      this.context.strokeStyle = 'black'

      for (const segment of msp) {
        this.context.moveTo(segment.a.x, segment.a.y)
        this.context.lineTo(segment.b.x, segment.b.y)
      }

      this.context.stroke()
    }
  }
}
