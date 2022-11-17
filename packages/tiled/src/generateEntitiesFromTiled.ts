import { ParsedObject } from './TiledMapParser'
import { TiledMap, TiledObject } from './tiledTypes'
import Agregate, { AggregateCollider, LoadState } from './Agregate'
import {
  Ecs,
  Entity,
  isRegistered,
  LoadingState,
  LoadingStateManager,
  Transform,
} from '@mythor/core'
import { Physic, PhysicType } from '@mythor/physic2d'
import { getPolygonCentroid, Vec2 } from '@mythor/math'
import { Renderable, Renderer, Sprite, TextureManager } from '@mythor/renderer'

type NameCallback = (entity: Entity, object: TiledObject) => void

interface GenerateEntitiesFromTiledOptions {
  name?: Record<string, NameCallback>
  aggreateColliders?: boolean
  generatePassiveColliders?: boolean
  maxBacth?: number
}

function addPhysic(
  tile: ParsedObject,
  entity: Entity,
  aggreateColliders,
  generatePassiveColliders
): void {
  if (!isRegistered(Physic)) {
    return
  }

  if (
    tile.collider.polygons.length > 0 &&
    (generatePassiveColliders || !aggreateColliders)
  ) {
    entity.add(
      new Physic({
        interactWithWorld: !aggreateColliders,
        polygons: tile.collider.polygons,
      })
    )
  } else if (tile.collider.ellipses.length > 0) {
    const ellipse = tile.collider.ellipses[0]
    entity.add(
      new Physic({
        type: PhysicType.STATIC,
        ellipses: [(ellipse.width + ellipse.height) / 4],
        offset: new Vec2(
          ellipse.x - ellipse.width / 2,
          ellipse.y - ellipse.height / 2
        ),
      })
    )
  } else if (generatePassiveColliders) {
    entity.add(
      new Physic({
        interactWithWorld: false,
      })
    )
  }
}

async function generateEntitiesFromTiled(
  ecs: Ecs,
  tiledMap: unknown,
  options?: GenerateEntitiesFromTiledOptions
): Promise<Record<string, Entity>> {
  const textures = ecs.manager(TextureManager)
  const aggreateColliders = options?.aggreateColliders ?? true
  const generatePassiveColliders = options?.generatePassiveColliders ?? true
  const entitiesToReturn: Record<string, Entity> = {}
  let state: LoadingState | undefined

  if (ecs.managers.has(LoadingStateManager)) {
    state = ecs.manager(LoadingStateManager).createState({
      detail: 'Map',
      name: 'Map',
      total: 1,
      weight: 90,
    })
  }

  const namedObject = (
    name: string,
    entity: Entity,
    object: TiledObject
  ): void => {
    options?.name?.[name](entity, object)
    entitiesToReturn[name] = entity
  }

  const onCreateObject = (object: TiledObject): void => {
    const { x, y, rotation, width, height, name } = object
    const entity = ecs.create().add(
      new Transform({
        position: new Vec2(x + width / 2, y - height / 2),
        rotation,
        size: new Vec2(width, height),
      })
    )
    if (name) {
      namedObject(name, entity, object)
    }
  }

  const onCreateTile = (tile: ParsedObject): void => {
    const imageName = tile.image.replace(/\.[^/.]+$/, '')
    const textureName = textures.has(imageName) ? imageName : tile.name
    const entity = ecs
      .create()
      .add(
        new Transform(tile.transform),
        new Renderable(),
        new Sprite(textures.get(textureName), tile.sprite)
      )
    addPhysic(tile, entity, aggreateColliders, generatePassiveColliders)
  }

  const onCreateCollider = (polygon: AggregateCollider): void => {
    const { centroid: position, size } = getPolygonCentroid(polygon)
    const relativePolygon = polygon.map((point) => point.sub(position).round(2))
    ecs.create().add(
      new Transform({
        position: position.round(2),
        size,
      }),
      new Physic({
        polygons: [relativePolygon],
      })
    )
  }

  const onLoad = (map: LoadState): void => {
    if (state) {
      state.current = map.current
      state.total = map.total
      state.weight = map.weight
    }
  }

  const onParsed = ({
    height,
    width,
    tileheight,
    tilewidth,
  }: TiledMap): void => {
    // @todo offset ??? position ??
    if (ecs.systems.has(Renderer)) {
      const w = width * tilewidth
      const h = height * tileheight
      ecs.system(Renderer).setTree({
        position: Vec2.create(w / 2 - tilewidth / 2, h / 2 - tileheight / 2),
        size: Vec2.create(w, h),
      })
    }
  }

  const mapParser = new Agregate(tiledMap, {
    onCreateCollider:
      aggreateColliders && isRegistered(Physic) ? onCreateCollider : undefined,
    onCreateObject,
    onCreateTile,
    onLoad,
    onParsed,
    maxBacth: options?.maxBacth,
  })

  await mapParser.parse()

  return entitiesToReturn
}

export default generateEntitiesFromTiled
