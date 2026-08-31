import TiledMapParser, {
  ParsedObject,
  TileMapParserOptions,
} from './TiledMapParser'
import { Vec2 } from '@mythor/math'
import {
  convertToConvexRegions,
  extractPolygons,
  extractRegions,
  Region,
} from './polygonDecomposition'

export type AggregateCollider = Vec2[]

export interface LoadState {
  current: number
  total: number
  weight: number
}

interface AggregateOptions extends TileMapParserOptions {
  onCreateCollider?: (collider: AggregateCollider) => void
  onLoad?: (args: LoadState) => void
  maxBacth?: number
}

class Aggregate {
  private readonly tilemapParser: TiledMapParser
  private readonly maxBacth: number
  private readonly tiles: ParsedObject[] = []
  private readonly onCreateCollider?: (collider: AggregateCollider) => void
  private readonly onLoad?: (args: LoadState) => void

  public constructor(map: unknown, options?: AggregateOptions) {
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

    const polygons = extractPolygons(this.tiles)

    if (!polygons.length) {
      return
    }

    this.onLoad?.({
      current: 0,
      total: polygons.length,
      weight: 90,
    })
    const regions = await extractRegions(
      polygons,
      this.maxBacth,
      (current, total) => {
        this.onLoad?.({ current, total, weight: 90 })
      }
    )
    const convexRegions = convertToConvexRegions(regions)
    convexRegions.forEach((convexRegion: Region) => {
      this.onCreateCollider?.(convexRegion.map(([x, y]) => Vec2.create(x, y)))
    })
  }
}

export default Aggregate
