// https://doc.mapeditor.org/en/stable/reference/json-map-format/

export interface Property {
  name: string
  type: string
  value: string
}

export enum MapOrientation {
  Orthogonal = 'orthogonal',
  Isometric = 'isometric',
  Staggered = 'staggered',
  Hexagonal = 'hexagonal',
}

export enum MapRenderOrder {
  RightDown = 'right-down',
  RightUp = 'right-up',
  LeftDown = 'left-down',
  LeftUp = 'left-up',
}

export interface Chunk {
  data: number[]
  x: number
  y: number
  height: number
  width: number
}

export interface TiledObject {
  id: number
  gid?: number
  properties?: Property[]
  height: number
  name: string
  rotation: number
  type: string
  visible: boolean
  width: number
  x: number
  y: number
}

export enum LayerType {
  Tilelayer = 'tilelayer',
  ObjectGroup = 'objectgroup',
  ImageLayer = 'imagelayer',
  Group = 'group',
}

export interface Layer {
  height?: number
  id: number
  name: string
  data?: number[]
  chunks?: Chunk[]
  image?: string
  objects?: TiledObject[]
  offsetx?: number
  offsety?: number
  opacity: number
  parallaxx?: number
  parallaxy?: number
  properties?: Property[]
  startx?: number
  starty?: number
  type: LayerType
  visible: boolean
  width?: number
  x: number
  y: number
}

/*
[
    {
        "height": 21,
        "id": 1,
        "name": "",
        "rotation": 0,
        "type": "",
        "visible": true,
        "width": 21,
        "x": 0,
        "y": 0
    },
    {
        "ellipse": true,
        "height": 0,
        "id": 2,
        "name": "",
        "rotation": 0,
        "type": "",
        "visible": true,
        "width": 0,
        "x": 10.5,
        "y": 10.5
    },
    {
        "height": 0,
        "id": 3,
        "name": "",
        "polygon": [
            {
                "x": 0,
                "y": 0
            },
            {
                "x": 5.25,
                "y": -5.25
            },
            {
                "x": 10.5,
                "y": 0
            },
            {
                "x": 15.75,
                "y": -5.25
            },
            {
                "x": 21,
                "y": 0
            },
            {
                "x": 21,
                "y": 10.5
            },
            {
                "x": 0,
                "y": 10.5
            }
        ],
        "rotation": 0,
        "type": "",
        "visible": true,
        "width": 0,
        "x": 0,
        "y": 10.5
    }
]
 */

export interface TileObject {
  height: number
  id: number
  name: string
  rotation: number
  type: string
  visible: boolean
  width: number
  x: number
  y: number
  ellipse?: boolean
  polygon?: Array<{ x: number; y: number }>
}

export interface Tile {
  id: number
  image?: string
  name?: string
  properties?: Property[]
  objectgroup?: {
    x: number
    y: number
    objects?: TileObject[]
  }
}

export interface Tileset {
  columns: number
  firstgid: number
  image?: string
  imageheight?: number
  imagewidth?: number
  margin: number
  name: string
  spacing: number
  tilecount: number
  tileheight: number
  tilewidth: number
  tiles?: Tile[]
}

export interface TiledMap {
  backgroundcolor?: string
  compressionlevel: number
  height: number
  width: number
  infinite: boolean
  layers: Layer[]
  nextlayerid: number
  nextobjectid: number
  orientation: MapOrientation
  properties?: Property[]
  renderorder: MapRenderOrder
  tiledversion: string
  tileheight: number
  tilewidth: number
  tilesets: Tileset[]
  version: number
}
