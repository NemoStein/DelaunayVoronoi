/** @typedef {import('@sourbit/geom').Triangle} Triangle */
/** @typedef {import('../src/PointGraph.js').PointGraph} PointGraph */

/**
 * @callback Renderer
 * @param {PointGraph} graph
 * @param {CanvasRenderingContext2D} context
 * @returns {void}
 */

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
   * @param {PointGraph} graph
   * @param {import('./app.js').DrawOptions} options
   */
  draw (graph, options) {
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight

    // this.render(graph, renderTest)

    if (options.drawCells) {
      this.render(graph, renderCells)
    }

    if (options.drawCircumcircles) {
      this.render(graph, renderCircumcircles)
    }

    if (options.drawCircumcenter) {
      this.render(graph, renderCircumcenters)
    }

    if (options.drawEdges) {
      this.render(graph, renderEdges)
    }

    if (options.drawSites) {
      this.render(graph, renderSites)
    }

    if (options.drawVoronoi) {
      this.render(graph, renderVoronoi)
    }

    if (options.drawMST) {
      this.render(graph, renderMST)
    }
  }

  /**
   * @param {PointGraph} graph
   * @param {Renderer} renderer
   */
  render (graph, renderer) {
    this.context.save()
    renderer(graph, this.context)
    this.context.restore()
  }
}

/** @type {Renderer} */
const renderCells = (graph, context) => {
  for (const cell of graph.delaunay.triangles) {
    context.beginPath()

    const alpha = (cell.circumcenter.x + cell.circumcenter.y) / 100 % 1
    context.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4 + 0.1})`
    context.moveTo(cell.a.x, cell.a.y)
    context.lineTo(cell.b.x, cell.b.y)
    context.lineTo(cell.c.x, cell.c.y)
    context.fill()
  }
}

/** @type {Renderer} */
const renderCircumcircles = (graph, context) => {
  for (const cell of graph.delaunay.triangles) {
    context.beginPath()
    context.lineWidth = 1
    context.strokeStyle = 'rgba(0, 0, 0, 0.2)'

    context.arc(cell.circumcenter.x, cell.circumcenter.y, cell.circumradius, 0, Math.PI * 2)
    context.stroke()
  }
}

/** @type {Renderer} */
const renderCircumcenters = (graph, context) => {
  for (const cell of graph.delaunay.triangles) {
    context.beginPath()
    context.fillStyle = 'blue'
    context.fillRect(cell.circumcenter.x - 3, cell.circumcenter.y - 3, 6, 6)
    context.fill()
  }
}

/** @type {Renderer} */
const renderEdges = (graph, context) => {
  for (const edge of graph.delaunay.segments) {
    context.lineWidth = 1.5
    context.strokeStyle = 'rgba(0, 0, 0, 0.5)'

    context.beginPath()
    context.moveTo(edge.a.x, edge.a.y)
    context.lineTo(edge.b.x, edge.b.y)
    context.stroke()
  }
}

/** @type {Renderer} */
const renderSites = (graph, context) => {
  for (const site of graph.delaunay.points) {
    context.beginPath()
    context.fillStyle = 'red'
    context.fillRect(site.x - 3, site.y - 3, 6, 6)
    context.fill()
  }
}

/** @type {Renderer} */
const renderVoronoi = (graph, context) => {
  context.lineWidth = 1
  context.strokeStyle = 'rgba(0, 255, 0, 0.5)'
  for (const cell of graph.delaunay.triangles) {
    /** @type {Set<Triangle>} */
    const neighbors = new Set()

    const tris = [
      .../** @type {Set<Triangle>} */(graph.delaunay.segmentTriangles.get(cell.ab)).values(),
      .../** @type {Set<Triangle>} */(graph.delaunay.segmentTriangles.get(cell.bc)).values(),
      .../** @type {Set<Triangle>} */(graph.delaunay.segmentTriangles.get(cell.ca)).values()
    ]

    tris.forEach(tri => neighbors.add(tri))

    for (const neighbor of neighbors) {
      context.beginPath()
      context.moveTo(cell.circumcenter.x, cell.circumcenter.y)
      context.lineTo(neighbor.circumcenter.x, neighbor.circumcenter.y)
      context.stroke()
    }
  }
}

/** @type {Renderer} */
const renderMST = (graph, context) => {
  const mst = graph.delaunay.generateMST()

  context.lineWidth = 4
  context.strokeStyle = 'black'

  for (const segment of mst) {
    context.beginPath()
    context.moveTo(segment.a.x, segment.a.y)
    context.lineTo(segment.b.x, segment.b.y)
    context.stroke()
  }
}
