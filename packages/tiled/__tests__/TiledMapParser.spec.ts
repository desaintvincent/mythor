import TiledMapParser, { ParsedObject } from '../src/TiledMapParser'
import { LayerType, MapOrientation, MapRenderOrder, TiledMap, TiledObject } from '../src/tiledTypes'

const tileset = {
  columns: 4,
  firstgid: 1,
  margin: 0,
  name: 'tiles',
  spacing: 0,
  tilecount: 16,
  tileheight: 32,
  tilewidth: 32,
}

const baseMap = {
  compressionlevel: -1,
  height: 5,
  width: 5,
  infinite: false,
  nextlayerid: 2,
  nextobjectid: 1,
  orientation: MapOrientation.Orthogonal,
  renderorder: MapRenderOrder.RightDown,
  tiledversion: '1.6.0',
  tileheight: 32,
  tilewidth: 32,
  version: 1.6,
  tilesets: [tileset],
  layers: [],
}

describe('TiledMapParser', () => {
  describe('constructor', () => {
    it('constructs with valid map', () => {
      expect(() => new TiledMapParser({ ...baseMap })).not.toThrow()
    })

    it('throws on invalid map', () => {
      expect(() => new TiledMapParser({ notAMap: true })).toThrow()
    })

    it('calls onParsed with the parsed map', () => {
      let received: TiledMap | null = null
      new TiledMapParser({ ...baseMap }, { onParsed: (m) => (received = m) })
      expect(received).not.toBeNull()
    })
  })

  describe('parse — tilelayer', () => {
    it('calls onCreateTile for each non-zero tile', () => {
      const map = {
        ...baseMap,
        layers: [
          {
            id: 1,
            name: 'Ground',
            type: LayerType.Tilelayer,
            visible: true,
            opacity: 1,
            x: 0,
            y: 0,
            width: 2,
            height: 2,
            // 4 tiles: 1,0,1,1 → 3 non-zero
            data: [1, 0, 1, 1],
          },
        ],
      }

      const tiles: ParsedObject[] = []
      const parser = new TiledMapParser(map, {
        onCreateTile: (t) => tiles.push(t),
      })
      parser.parse()

      expect(tiles).toHaveLength(3)
    })

    it('tile has expected shape (tileId, image, transform, sprite, collider)', () => {
      const map = {
        ...baseMap,
        layers: [
          {
            id: 1,
            name: 'Ground',
            type: LayerType.Tilelayer,
            visible: true,
            opacity: 1,
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            data: [1],
          },
        ],
      }

      let tile: ParsedObject | null = null
      const parser = new TiledMapParser(map, { onCreateTile: (t) => (tile = t) })
      parser.parse()

      expect(tile).not.toBeNull()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const t = tile!
      expect(t.tileId).toBe(1)
      expect(t.image).toBe('')   // no image in tileset
      expect(t.transform.position).toBeDefined()
      expect(t.transform.size).toBeDefined()
      expect(t.sprite.layer).toBe(0)
      expect(t.collider).toEqual({ ellipses: [], polygons: [] })
    })

    it('invisible layer is skipped', () => {
      const map = {
        ...baseMap,
        layers: [
          {
            id: 1,
            name: 'Hidden',
            type: LayerType.Tilelayer,
            visible: false,
            opacity: 1,
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            data: [1],
          },
        ],
      }

      const tiles: ParsedObject[] = []
      const parser = new TiledMapParser(map, { onCreateTile: (t) => tiles.push(t) })
      parser.parse()
      expect(tiles).toHaveLength(0)
    })
  })

  describe('parse — objectgroup', () => {
    it('calls onCreateObject for objects without gid', () => {
      const map = {
        ...baseMap,
        layers: [
          {
            id: 1,
            name: 'Objects',
            type: LayerType.ObjectGroup,
            visible: true,
            opacity: 1,
            x: 0,
            y: 0,
            objects: [
              {
                id: 1,
                name: 'spawn',
                type: '',
                visible: true,
                x: 10,
                y: 10,
                width: 0,
                height: 0,
                rotation: 0,
              },
            ],
          },
        ],
      }

      const objects: TiledObject[] = []
      const parser = new TiledMapParser(map, {
        onCreateObject: (o) => objects.push(o),
      })
      parser.parse()

      expect(objects).toHaveLength(1)
      expect(objects[0].name).toBe('spawn')
    })

    it('invisible objects are skipped', () => {
      const map = {
        ...baseMap,
        layers: [
          {
            id: 1,
            name: 'Objects',
            type: LayerType.ObjectGroup,
            visible: true,
            opacity: 1,
            x: 0,
            y: 0,
            objects: [
              {
                id: 1,
                name: 'hidden',
                type: '',
                visible: false,
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                rotation: 0,
              },
            ],
          },
        ],
      }

      const objects: TiledObject[] = []
      const parser = new TiledMapParser(map, {
        onCreateObject: (o) => objects.push(o),
      })
      parser.parse()
      expect(objects).toHaveLength(0)
    })
  })
})
