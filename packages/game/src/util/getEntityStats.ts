import { Entity, Transform } from '@mythor/core'

const getEntityStats = (entity: Entity): string => {
  const { position, size, rotation } = entity.get(Transform)

  return JSON.stringify(
    {
      id: entity._id,
      transform: {
        position: {
          x: position.x,
          y: position.y,
        },
        size: {
          x: size.x,
          y: size.y,
        },
        rotation,
      },
      components: entity.components.map((c) => c.constructor.name),
    },
    null,
    1
  )
}

export default getEntityStats
