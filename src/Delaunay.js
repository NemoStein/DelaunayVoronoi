import { Point, Segment, Triangle } from '@sourbit/geom'

export class Delaunay {
  constructor () {
    /** @type {Set<Point>} */
    this.points = new Set()

    /** @type {Set<Segment>} */
    this.segments = new Set()

    /** @type {Set<Triangle>} */
    this.triangles = new Set()

    /** @type {Map<Point, Set<Segment>>} */
    this.pointSegments = new Map()

    /** @type {Map<Segment, Set<Triangle>>} */
    this.segmentTriangles = new Map()
  }

  /**
   * @param {Point[]} points
   */
  triangulate (points) {
    const { a, b, c } = this.insertSuperTriangle(points)

    for (const point of points) {
      this.pointSegments.set(point, new Set())
      const affectedTriangles = this.getAffectedTriangles(point, a, b, c)

      /** @type {Set<Segment>} */
      const possibleSharedSegments = new Set()

      /** @type {Set<Segment>} */
      const sharedSegments = new Set()

      /** @type {Set<Point>} */
      const sharedPoints = new Set()

      /** @type {Segment[]} */
      const newSegments = []

      for (const triangle of affectedTriangles) {
        this.triangles.delete(triangle)

        this.segmentTriangles.get(triangle.ab)?.delete(triangle)
        this.segmentTriangles.get(triangle.bc)?.delete(triangle)
        this.segmentTriangles.get(triangle.ca)?.delete(triangle)

        if (affectedTriangles.length > 1) {
          for (const neighbour of affectedTriangles) {
            if (triangle === neighbour) {
              continue
            }

            if (neighbour.has(triangle.ab)) {
              this.pointSegments.get(triangle.ab.a)?.delete(triangle.ab)
              this.pointSegments.get(triangle.ab.b)?.delete(triangle.ab)
              this.segmentTriangles.delete(triangle.ab)
              this.segments.delete(triangle.ab)
            } else {
              possibleSharedSegments.add(triangle.ab)
            }

            if (neighbour.has(triangle.bc)) {
              this.pointSegments.get(triangle.bc.a)?.delete(triangle.bc)
              this.pointSegments.get(triangle.bc.b)?.delete(triangle.bc)
              this.segmentTriangles.delete(triangle.bc)
              this.segments.delete(triangle.bc)
            } else {
              possibleSharedSegments.add(triangle.bc)
            }

            if (neighbour.has(triangle.ca)) {
              this.pointSegments.get(triangle.ca.a)?.delete(triangle.ca)
              this.pointSegments.get(triangle.ca.b)?.delete(triangle.ca)
              this.segmentTriangles.delete(triangle.ca)
              this.segments.delete(triangle.ca)
            } else {
              possibleSharedSegments.add(triangle.ca)
            }
          }
        } else {
          sharedSegments.add(triangle.ab)
          sharedSegments.add(triangle.bc)
          sharedSegments.add(triangle.ca)
        }
      }

      for (const segment of possibleSharedSegments) {
        if (this.segments.has(segment)) {
          sharedSegments.add(segment)
        }
      }

      for (const shared of sharedSegments) {
        sharedPoints.add(shared.a)
        sharedPoints.add(shared.b)
      }

      for (const shared of sharedPoints) {
        const segment = new Segment(shared, point)

        this.pointSegments.get(shared)?.add(segment)
        this.pointSegments.get(point)?.add(segment)

        this.segmentTriangles.set(segment, new Set())

        newSegments.push(segment)
        this.segments.add(segment)
      }

      for (const ab of sharedSegments) {
        /** @type {Segment} */
        const bc = (newSegments.find(segment => segment.has(ab.a)))

        /** @type {Segment} */
        const ca = (newSegments.find(segment => segment !== bc && segment.has(ab.b)))

        const triangle = new Triangle(ab, bc, ca)
        // Breaking collinearity
        while (triangle.area === 0) {
          triangle.a.x += Math.random() - 0.5
          triangle.a.y += Math.random() - 0.5
          triangle.b.x += Math.random() - 0.5
          triangle.b.y += Math.random() - 0.5
          triangle.c.x += Math.random() - 0.5
          triangle.c.y += Math.random() - 0.5
        }

        this.segmentTriangles.get(ab)?.add(triangle)
        this.segmentTriangles.get(bc)?.add(triangle)
        this.segmentTriangles.get(ca)?.add(triangle)

        this.triangles.add(triangle)
      }

      this.points.add(point)
    }

    this.removeSuperTriangle(a, b, c)
  }

  generateMST () {
    /** @type {Segment[]} */
    const mst = []
    const segments = [...this.segments].sort((a, b) => a.length - b.length)

    /** @type {Map<Point, Point>} */
    const parents = new Map()

    /** @param {Point} point */
    const traverse = point => {
      while (parents.has(point)) point = /** @type {Point} */ (parents.get(point))
      return point
    }

    for (const segment of segments) {
      const a = traverse(segment.a)
      const b = traverse(segment.b)

      if (a !== b) {
        parents.set(a, b)
        mst.push(segment)
      }
    }

    return mst
  }

  /**
   * @param {Point[]} points
   */
  insertSuperTriangle (points) {
    const min = {
      x: Infinity,
      y: Infinity
    }
    const max = {
      x: -Infinity,
      y: -Infinity
    }

    for (const point of points) {
      if (min.x > point.x) min.x = point.x
      if (min.y > point.y) min.y = point.y
      if (max.x < point.x) max.x = point.x
      if (max.y < point.y) max.y = point.y
    }

    const offsetX = (min.x + max.x) / 2
    const offsetY = (min.y + max.y) / 2

    const distance = Point.distance(
      new Point(min.x, min.y),
      new Point(max.x, max.y)
    )

    const step = Math.PI * 2 / 3

    const a = new Point(Math.cos(0 * step) * distance + offsetX, Math.sin(0 * step) * distance + offsetY)
    const b = new Point(Math.cos(1 * step) * distance + offsetX, Math.sin(1 * step) * distance + offsetY)
    const c = new Point(Math.cos(2 * step) * distance + offsetX, Math.sin(2 * step) * distance + offsetY)

    const ab = new Segment(a, b)
    const bc = new Segment(b, c)
    const ca = new Segment(c, a)

    const abc = new Triangle(ab, bc, ca)

    this.points.clear()
    this.segments.clear()
    this.triangles.clear()

    this.points.add(a)
    this.points.add(b)
    this.points.add(c)

    this.segments.add(ab)
    this.segments.add(bc)
    this.segments.add(ca)

    this.triangles.add(abc)

    return { a, b, c }
  }

  /**
   * @param {Point} a
   * @param {Point} b
   * @param {Point} c
   */
  removeSuperTriangle (a, b, c) {
    const removeSegments = new Set()
    const removeTriangles = new Set()

    for (const segment of this.segments) {
      if (segment.has(a) || segment.has(b) || segment.has(c)) {
        removeSegments.add(segment)

        for (const triangle of this.triangles) {
          if (triangle.has(segment)) {
            removeTriangles.add(triangle)
          }
        }
      }
    }

    this.points.delete(a)
    this.points.delete(b)
    this.points.delete(c)

    for (const triangle of removeTriangles) {
      this.triangles.delete(triangle)

      this.segmentTriangles.get(triangle.ab)?.delete(triangle)
      this.segmentTriangles.get(triangle.bc)?.delete(triangle)
      this.segmentTriangles.get(triangle.ca)?.delete(triangle)
    }

    for (const segment of removeSegments) {
      this.segments.delete(segment)

      this.pointSegments.get(segment.a)?.delete(segment)
      this.pointSegments.get(segment.b)?.delete(segment)

      this.segmentTriangles.delete(segment)
    }

    this.pointSegments.delete(a)
    this.pointSegments.delete(b)
    this.pointSegments.delete(c)
  }

  /**
   * @param {Point} point
   * @param {Point} a
   * @param {Point} b
   * @param {Point} c
   */
  getAffectedTriangles (point, a, b, c) {
  /** @type {Triangle[]} */
    const result = []

    for (const triangle of this.triangles) {
      const hasA = triangle.has(a)
      const hasB = triangle.has(b)
      const hasC = triangle.has(c)

      let shared = 0

      if (hasA) shared++
      if (hasB) shared++
      if (hasC) shared++

      if (shared === 1) {
        const shared = hasA ? a : hasB ? b : c
        const segment = !triangle.ab.has(shared)
          ? triangle.ab
          : !triangle.bc.has(shared)
              ? triangle.bc
              : triangle.ca

        const side = Segment.pointSide(segment, point)

        if (triangle.winding !== side) {
          result.push(triangle)
        }

        continue
      }

      if (shared === 2) {
        const notShared = !hasA ? a : !hasB ? b : c
        const segment = !triangle.ab.has(notShared)
          ? triangle.ab
          : !triangle.bc.has(notShared)
              ? triangle.bc
              : triangle.ca
        const slope = segment.slope
        const thirdVertex = !segment.has(triangle.a) ? triangle.a : !segment.has(triangle.b) ? triangle.b : triangle.c

        const slopedSegment = new Segment(thirdVertex, new Point(Math.cos(slope) * 100 + thirdVertex.x, Math.sin(slope) * 100 + thirdVertex.y))
        const side = Segment.pointSide(slopedSegment, point)

        if (triangle.winding === side) {
          result.push(triangle)
        }

        continue
      }

      const circumcenter = triangle.circumcenter
      const circumradius = triangle.circumradius

      const dx = point.x - circumcenter.x
      const dy = point.y - circumcenter.y

      if (dx ** 2 + dy ** 2 <= circumradius ** 2) {
        result.push(triangle)
      }
    }

    return result
  }
}
