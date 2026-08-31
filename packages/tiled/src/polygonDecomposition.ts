import * as PolyBool from 'polybooljs'
import * as decomp from 'poly-decomp'
import { ParsedObject } from './TiledMapParser'

export type Region = Array<[number, number]>

interface Poly {
  regions: Region[]
  inverted: boolean
}

interface Segment {
  segments: Array<{
    id: number
    start: [number, number]
    end: [number, number]
    myFill: {
      above: boolean
      below: boolean
    }
    otherFill: null
  }>
  inverted: boolean
}

/**
 * Turns the collider polygons of a set of tiles (in tilemap-relative
 * coordinates) into world-space polygons ready for boolean union.
 */
export function extractPolygons(tiles: ParsedObject[]): Poly[] {
  const polygons: Poly[] = []
  tiles.forEach((tile) => {
    tile.collider.polygons.forEach((polygon) => {
      polygons.push({
        inverted: false,
        regions: [
          polygon.map(({ x, y }) => [
            x + tile.transform.position.x,
            y + tile.transform.position.y,
          ]),
        ],
      })
    })
  })

  return polygons
}

/**
 * Unions a batch of polygons into merged regions, yielding to the event loop
 * every `maxBatch` iterations so large maps do not block the main thread.
 */
export async function extractRegions(
  polygons: Poly[],
  maxBatch: number,
  onProgress?: (current: number, total: number) => void
): Promise<Region[]> {
  PolyBool.epsilon(0.5)

  return await new Promise<Region[]>((resolve) => {
    let batch = 0
    let segments = PolyBool.segments(polygons[0])

    const asyncSegments = (
      i: number,
      cb: (segments: Segment) => void
    ): void => {
      const seg2 = PolyBool.segments(polygons[i])
      const comb = PolyBool.combine(segments, seg2)
      segments = PolyBool.selectUnion(comb)
      if (i === polygons.length - 1) {
        cb(segments)

        return
      }

      onProgress?.(i, polygons.length)

      if (batch++ >= maxBatch) {
        batch = 0
        setTimeout(asyncSegments.bind(null, i + 1, cb), 0)
      } else {
        asyncSegments(i + 1, cb)
      }
    }

    asyncSegments(1, function (segments) {
      const { regions } = PolyBool.polygon(segments)
      resolve(regions)
    })
  })
}

/** Splits concave regions into convex polygons using `poly-decomp`. */
export function convertToConvexRegions(regions: Region[]): Region[] {
  const convexRegions: Region[] = []
  for (const region of regions) {
    if (region.length < 5) {
      convexRegions.push(region)
      continue
    }

    decomp.makeCCW(region)
    const convexPolygons = decomp.quickDecomp(region)

    convexRegions.push(...(convexPolygons as Region[]))
  }

  return convexRegions
}
