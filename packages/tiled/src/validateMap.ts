import Ajv, { JSONSchemaType } from 'ajv'
import {
  TiledMap,
  MapOrientation,
  MapRenderOrder,
  Property,
  Layer,
  LayerType,
  Tileset,
  Tile,
  Chunk,
  TiledObject,
  TileObject,
} from './tiledTypes'
import { log } from '@mythor/core'

const propertySchema: JSONSchemaType<Property> = {
  properties: {
    name: { type: 'string' },
    type: { type: 'string' },
    value: { type: 'string' },
  },
  required: ['name', 'type', 'value'],
  type: 'object',
}

const chunkSchema: JSONSchemaType<Chunk> = {
  properties: {
    data: { items: { type: 'number' }, type: 'array' },
    height: { type: 'number' },
    width: { type: 'number' },
    x: { type: 'number' },
    y: { type: 'number' },
  },
  required: ['x', 'y', 'width', 'height', 'data'],
  type: 'object',
}

const objectSchema: JSONSchemaType<TiledObject> = {
  properties: {
    gid: { nullable: true, type: 'number' },
    height: { type: 'number' },
    id: { type: 'number' },
    name: { type: 'string' },
    properties: { items: propertySchema, nullable: true, type: 'array' },
    rotation: { type: 'number' },
    type: { type: 'string' },
    visible: { type: 'boolean' },
    width: { type: 'number' },
    x: { type: 'number' },
    y: { type: 'number' },
  },
  required: [
    'id',
    'height',
    'name',
    'rotation',
    'type',
    'visible',
    'width',
    'x',
    'y',
  ],
  type: 'object',
}

const layerSchema: JSONSchemaType<Layer> = {
  properties: {
    chunks: { items: chunkSchema, nullable: true, type: 'array' },
    data: { items: { type: 'number' }, nullable: true, type: 'array' },
    height: { nullable: true, type: 'number' },
    id: { type: 'number' },
    image: { nullable: true, type: 'string' },
    name: { type: 'string' },
    objects: { items: objectSchema, nullable: true, type: 'array' },
    offsetx: { nullable: true, type: 'number' },
    offsety: { nullable: true, type: 'number' },
    opacity: { type: 'number' },
    parallaxx: { nullable: true, type: 'number' },
    parallaxy: { nullable: true, type: 'number' },
    properties: { items: propertySchema, nullable: true, type: 'array' },
    startx: { nullable: true, type: 'number' },
    starty: { nullable: true, type: 'number' },
    type: { enum: Object.values(LayerType), type: 'string' },
    visible: { type: 'boolean' },
    width: { nullable: true, type: 'number' },
    x: { type: 'number' },
    y: { type: 'number' },
  },
  required: ['id', 'name', 'opacity', 'type', 'visible', 'x', 'y'],
  type: 'object',
}

const tileObjectSchema: JSONSchemaType<TileObject> = {
  properties: {
    ellipse: { nullable: true, type: 'boolean' },
    height: { type: 'number' },
    id: { type: 'number' },
    name: { type: 'string' },
    polygon: {
      items: {
        properties: {
          x: { type: 'number' },
          y: { type: 'number' },
        },
        required: ['x', 'y'],
        type: 'object',
      },
      nullable: true,
      type: 'array',
    },
    rotation: { type: 'number' },
    type: { type: 'string' },
    visible: { type: 'boolean' },
    width: { type: 'number' },
    x: { type: 'number' },
    y: { type: 'number' },
  },
  required: [
    'height',
    'id',
    'name',
    'rotation',
    'type',
    'visible',
    'width',
    'x',
    'y',
  ],
  type: 'object',
}

const tileSchema: JSONSchemaType<Tile> = {
  properties: {
    id: { type: 'number' },
    image: { nullable: true, type: 'string' },
    objectgroup: {
      nullable: true,
      properties: {
        objects: { items: tileObjectSchema, nullable: true, type: 'array' },
        x: { type: 'number' },
        y: { type: 'number' },
      },
      required: ['x', 'y'],
      type: 'object',
    },
    properties: { items: propertySchema, nullable: true, type: 'array' },
  },
  required: ['id'],
  type: 'object',
}

const tilesetShema: JSONSchemaType<Tileset> = {
  properties: {
    columns: { type: 'number' },
    firstgid: { type: 'number' },
    image: { nullable: true, type: 'string' },
    imageheight: { nullable: true, type: 'number' },
    imagewidth: { nullable: true, type: 'number' },
    margin: { type: 'number' },
    name: { type: 'string' },
    spacing: { type: 'number' },
    tilecount: { type: 'number' },
    tileheight: { type: 'number' },
    tiles: { items: tileSchema, nullable: true, type: 'array' },
    tilewidth: { type: 'number' },
  },
  required: [
    'columns',
    'firstgid',
    'margin',
    'name',
    'spacing',
    'tilecount',
    'tileheight',
    'tilewidth',
  ],
  type: 'object',
}

const mapSchema: JSONSchemaType<TiledMap> = {
  properties: {
    backgroundcolor: { nullable: true, type: 'string' },
    compressionlevel: { type: 'number' },
    height: { type: 'number' },
    infinite: { type: 'boolean' },
    layers: { items: layerSchema, type: 'array' },
    nextlayerid: { type: 'number' },
    nextobjectid: { type: 'number' },
    orientation: { enum: Object.values(MapOrientation), type: 'string' },
    properties: { items: propertySchema, nullable: true, type: 'array' },
    renderorder: { enum: Object.values(MapRenderOrder), type: 'string' },
    tiledversion: { type: 'string' },
    tileheight: { type: 'number' },
    tilesets: { items: tilesetShema, type: 'array' },
    tilewidth: { type: 'number' },
    version: { type: 'number' },
    width: { type: 'number' },
  },
  required: [
    'compressionlevel',
    'height',
    'width',
    'infinite',
    'nextlayerid',
    'nextobjectid',
    'orientation',
    'renderorder',
    'tiledversion',
    'tileheight',
    'tilewidth',
    'version',
  ],
  type: 'object',
}

function validateMap(map: unknown): asserts map is TiledMap {
  const ajv = new Ajv({
    allErrors: true,
    coerceTypes: true,
    removeAdditional: true,
  })
  const validate = ajv.compile(mapSchema)

  if (!validate(map)) {
    log(validate.errors, 'red')
    throw new Error('Could not validate map')
  }
}

export default validateMap
