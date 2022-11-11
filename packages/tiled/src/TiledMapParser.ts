import validateMap from './validateMap'
import {
  Chunk,
  Layer,
  LayerType,
  TiledMap,
  Tileset,
  Tile,
  TiledObject,
} from './tiledTypes'
import { Vec2 } from '@mythor/math'
import { log } from '@mythor/core'

export interface TileMapParserOptions {
  onCreateTile?: (tile: ParsedObject) => void
  onCreateObject?: (object: TiledObject) => void
  onParsed?: (map: TiledMap) => void
}

interface ParsedEllipseCollider {
  x: number
  y: number
  width: number
  height: number
}
type ParsedPolygonCollider = Array<{ x: number; y: number }>

interface ParsedCollider {
  ellipses: ParsedEllipseCollider[]
  polygons: ParsedPolygonCollider[]
}

export interface ParsedObject {
  tileId: number
  image: string
  name: string
  transform: {
    position: Vec2
    size: Vec2
  }
  sprite: {
    size: Vec2
    origin: Vec2
    parallax: Vec2
    layer: number
  }
  collider: ParsedCollider
}

class TiledMapParser {
  private readonly map: TiledMap
  private readonly onCreateTile?: (tile: ParsedObject) => void
  private readonly onCreateObject?: (object: TiledObject) => void

  private countTileQueries: Record<number, number> = {}

  public constructor(map: unknown, options?: TileMapParserOptions) {
    validateMap(map)
    this.map = map
    options?.onParsed?.(map)
    this.onCreateTile = options?.onCreateTile
    this.onCreateObject = options?.onCreateObject
  }

  public parse(): void {
    this.map.layers.forEach((layer, index) => {
      if (!layer.visible) {
        return
      }
      switch (layer.type) {
        case LayerType.Tilelayer:
          return this.parseTileLayer(layer, index)
        case LayerType.ObjectGroup:
          return this.parseObjectGroup(layer, index)
        default:
          log(`layer type ${layer.type} not supported yet`)
      }
    })
  }

  private getTileset(tileId: number): Tileset | undefined {
    return this.map.tilesets.find(
      ({ firstgid, tilecount }) =>
        tileId >= firstgid && tileId < firstgid + tilecount
    )
  }

  private getTile(tileset: Tileset, gid: number): Tile | undefined {
    // @todo should i register maps?
    this.countTileQueries[gid] = this.countTileQueries?.[gid]
      ? this.countTileQueries?.[gid] + 1
      : 1
    const tile = tileset.tiles?.find(
      (tile) => tile.id + tileset.firstgid === gid
    )

    return tile
  }

  private parseObjectGroup(layer: Layer, index: number): void {
    layer.objects?.forEach((object) => {
      if (!object.visible) {
        return
      }

      if (!object.gid) {
        return this.onCreateObject?.(object)
      }
      const tileset = this.getTileset(object.gid)
      if (!tileset) {
        return
      }
      const tile = this.getTile(tileset, object.gid)

      const transformSize = new Vec2(object.width, object.height)
      const returnTile: ParsedObject = {
        collider: this.generateCollider(tile, transformSize),
        image: tile?.image ?? '',
        name: tile?.name ?? '',
        sprite: {
          layer: index,
          origin: new Vec2(0, 0),
          parallax: new Vec2(layer?.parallaxx ?? 1, layer?.parallaxy ?? 1),
          size: new Vec2(1, 1),
        },
        tileId: object.gid,
        transform: {
          position: new Vec2(
            object.x + layer.x - object.width / 2,
            object.y + layer.y - object.height / 2
          ),
          size: transformSize,
        },
      }

      this.onCreateTile?.(returnTile)
    })
  }

  private parseTileLayer(layer: Layer, index: number): void {
    if (!this.onCreateTile) {
      return
    }

    if (layer.data) {
      return this.parseLayerData(layer, index)
    }
    layer.chunks?.forEach((chunk) => {
      this.parseLayerData(chunk, index)
    })
  }

  private generateCollider(tile?: Tile, size?: Vec2): ParsedCollider {
    if (!tile?.objectgroup?.objects) {
      return { ellipses: [], polygons: [] }
    }

    const ellipses: ParsedEllipseCollider[] = []
    const polygons: ParsedPolygonCollider[] = []

    const objects = tile?.objectgroup?.objects

    objects.forEach((object) => {
      const { width, height, visible } = object
      if (!visible) {
        return
      }

      if (object.ellipse) {
        ellipses.push({
          height: object.height,
          width: object.width,
          x: object.x,
          y: object.y,
        })
      } else {
        polygons.push(
          (
            object.polygon ?? [
              { x: 0, y: 0 },
              { x: width, y: 0 },
              { x: width, y: height },
              { x: 0, y: height },
            ]
          ).map(({ x, y }) => ({
            x: object.x + x - (size?.x ? size.x / 2 : 0),
            y: object.y + y - (size?.y ? size.y / 2 : 0),
          }))
        )
      }
    })

    return { ellipses, polygons }
  }

  private parseLayerData(layer: Layer | Chunk, index: number): void {
    layer.data?.forEach((tileId, tileIndex) => {
      if (!tileId) {
        return
      }

      const tileset = this.getTileset(tileId)

      if (!tileset) {
        return
      }

      if (!layer?.width || !layer.height) {
        throw new Error('pas bon')
      }

      const columns = tileset.columns
      const rows = tileset.tilecount / columns

      const tileX = tileIndex % layer.width
      const tileY = Math.floor(tileIndex / layer.width)
      const transformPosition = new Vec2(
        (tileX + layer.x) * this.map.tilewidth,
        (tileY + layer.y) * this.map.tileheight
      )

      const textureX = (tileId - tileset.firstgid) % columns
      const textureY = Math.floor((tileId - tileset.firstgid) / columns)

      const transformSize = new Vec2(tileset.tilewidth, tileset.tileheight)
      const texturePosition = new Vec2(textureX / columns, textureY / rows)
      const textureSize = new Vec2(1 / columns, 1 / rows)

      const tile = this.getTile(tileset, tileId)

      const returnTile: ParsedObject = {
        collider: this.generateCollider(tile, transformSize),
        image: tileset?.image ?? '',
        name: tileset?.name ?? '',
        sprite: {
          layer: index,
          origin: texturePosition,
          parallax: new Vec2(
            ('parallaxx' in layer ? layer.parallaxx : 1) ?? 1,
            ('parallaxy' in layer ? layer.parallaxy : 1) ?? 1
          ),
          size: textureSize,
        },
        tileId,
        transform: {
          position: transformPosition,
          size: transformSize,
        },
      }
      this.onCreateTile?.(returnTile)
    })
  }
}

export default TiledMapParser
