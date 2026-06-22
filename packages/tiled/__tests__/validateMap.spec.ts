import validateMap from '../src/validateMap'
import { MapOrientation, MapRenderOrder, LayerType } from '../src/tiledTypes'

const minimalValidMap = {
  compressionlevel: -1,
  height: 10,
  width: 10,
  infinite: false,
  layers: [],
  nextlayerid: 2,
  nextobjectid: 1,
  orientation: MapOrientation.Orthogonal,
  renderorder: MapRenderOrder.RightDown,
  tiledversion: '1.6.0',
  tileheight: 32,
  tilewidth: 32,
  version: 1.6,
  tilesets: [],
}

describe('validateMap', () => {
  it('valid map passes without throwing', () => {
    expect(() => validateMap({ ...minimalValidMap })).not.toThrow()
  })

  it('missing required field (height) throws', () => {
    const bad = { ...minimalValidMap }
    delete (bad as Record<string, unknown>).height
    expect(() => validateMap(bad)).toThrow('Could not validate map')
  })

  it('missing orientation throws', () => {
    const bad = { ...minimalValidMap }
    delete (bad as Record<string, unknown>).orientation
    expect(() => validateMap(bad)).toThrow('Could not validate map')
  })

  it('invalid orientation value throws', () => {
    const bad = { ...minimalValidMap, orientation: 'diagonal' }
    expect(() => validateMap(bad)).toThrow('Could not validate map')
  })

  it('invalid renderorder value throws', () => {
    const bad = { ...minimalValidMap, renderorder: 'up-left' }
    expect(() => validateMap(bad)).toThrow('Could not validate map')
  })

  it('missing infinite field throws', () => {
    const bad = { ...minimalValidMap }
    delete (bad as Record<string, unknown>).infinite
    expect(() => validateMap(bad)).toThrow('Could not validate map')
  })

  it('valid map with a tilelayer passes', () => {
    const map = {
      ...minimalValidMap,
      layers: [
        {
          id: 1,
          name: 'Ground',
          type: LayerType.Tilelayer,
          visible: true,
          opacity: 1,
          x: 0,
          y: 0,
          width: 10,
          height: 10,
          data: [1, 0, 0, 1],
        },
      ],
      tilesets: [
        {
          columns: 4,
          firstgid: 1,
          margin: 0,
          name: 'tileset',
          spacing: 0,
          tilecount: 16,
          tileheight: 32,
          tilewidth: 32,
        },
      ],
    }
    expect(() => validateMap(map)).not.toThrow()
  })

  it('layer missing required field (name) throws', () => {
    const map = {
      ...minimalValidMap,
      layers: [
        {
          id: 1,
          type: LayerType.Tilelayer,
          visible: true,
          opacity: 1,
          x: 0,
          y: 0,
        },
      ],
    }
    expect(() => validateMap(map)).toThrow('Could not validate map')
  })
})
