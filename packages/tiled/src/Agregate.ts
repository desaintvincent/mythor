import * as PolyBool from 'polybooljs'
import * as decomp from 'poly-decomp'
import TiledMapParser, {
  ParsedObject,
  TileMapParserOptions,
} from './TiledMapParser'
import { Vec2 } from '@mythor/math'

type Region = Array<[number, number]>

interface Poly {
  regions: Region[]
  inverted: boolean
}

export type AggregateCollider = Vec2[]

export interface LoadState {
  current: number
  total: number
  weight: number
}

interface AgregateOptions extends TileMapParserOptions {
  onCreateCollider?: (collider: AggregateCollider) => void
  onLoad?: (args: LoadState) => void
  maxBacth?: number
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

class Agregate {
  private readonly tilemapParser: TiledMapParser
  private readonly maxBacth: number
  private readonly tiles: ParsedObject[] = []
  private readonly onCreateCollider?: (collider: AggregateCollider) => void
  private readonly onLoad?: (args: LoadState) => void

  public constructor(map: unknown, options?: AgregateOptions) {
    this.maxBacth = options?.maxBacth ?? 10
    const { onCreateCollider, onLoad, ...tilemapParserOptions } = options ?? {}
    this.onCreateCollider = onCreateCollider
    this.onLoad = onLoad
    this.onLoad?.({
      current: 0,
      total: 1,
      weight: 90,
    })
    this.tilemapParser = new TiledMapParser(map, {
      ...tilemapParserOptions,
      onCreateTile: (tile: ParsedObject) => {
        if (this.onCreateCollider && tile.collider.polygons.length > 0) {
          this.tiles.push(tile)
        }
        options?.onCreateTile?.(tile)
      },
    })
  }

  public async parse(): Promise<void> {
    this.tilemapParser.parse()

    if (!this.onCreateCollider) {
      return
    }

    const polygons = this.extractPolygons()

    if (!polygons.length) {
      return
    }

    this.onLoad?.({
      current: 0,
      total: polygons.length,
      weight: 90,
    })
    PolyBool.epsilon(0.5)
    const regions = await this.extractRegions(polygons)
    const convexRegions = this.convertToConvexRegions(regions)
    convexRegions.forEach((convexRegion: Region) => {
      this.onCreateCollider?.(convexRegion.map(([x, y]) => Vec2.create(x, y)))
    })
  }

  private convertToConvexRegions(regions: Region[]): Region[] {
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

  private async extractRegions(polygons: Poly[]): Promise<Region[]> {
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

        this.onLoad?.({
          current: i,
          total: polygons.length,
          weight: 90,
        })

        if (batch++ >= this.maxBacth) {
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

  private extractPolygons(): Poly[] {
    const polygons: Poly[] = []
    this.tiles.forEach((tile) => {
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
}

export default Agregate
