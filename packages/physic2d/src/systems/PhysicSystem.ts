import {
  AABB,
  Body,
  Contact,
  Vec2 as PlankVec2,
  WeldJoint,
  World,
} from 'planck-js'
import { Vec2 } from '@mythor/math'
import { Entity, Owner, System, Transform } from '@mythor/core'
import Physic, { PhysicType } from '../components/Physic'
import ColliderCallback from '../components/ColliderCallback'
import { Box, Circle, Polygon } from 'planck-js/lib'

interface PhysicSystemOptions {
  gravity?: Vec2
  worldScale?: number
}

interface EntityBodyData {
  entityId: string
}

interface StickyInfo {
  arrowBody: Body
  targetBody: Body
  contactPosition?: Vec2
}

export const IGNORED_BY_WORLD = parseInt('100', 2)

export default class PhysicSystem extends System {
  public readonly worldScale: number
  public readonly world: World
  private readonly collisionsToMakeSticky: StickyInfo[] = []

  public constructor(options?: PhysicSystemOptions) {
    super('PhysicSystem', [Transform, Physic])
    this.worldScale = options?.worldScale ?? 30
    this.world = World({
      gravity: PlankVec2(
        options?.gravity?.x ?? 0.0,
        options?.gravity?.y ?? 100
      ),
    })
  }

  private getEntitiesFromContact(contact: Contact): {
    entityA?: Entity
    entityB?: Entity
  } {
    const fA = contact.getFixtureA()
    const fB = contact.getFixtureB()
    const bA = fA.getBody()
    const bB = fB.getBody()
    const { entityId: entityIdA } = bA.getUserData() as EntityBodyData
    const { entityId: entityIdB } = bB.getUserData() as EntityBodyData

    const entityA = this.ecs.entity(entityIdA)
    const entityB = this.ecs.entity(entityIdB)

    return { entityA, entityB }
  }

  private preSolve(contact: Contact): void {
    const { entityA, entityB } = this.getEntitiesFromContact(contact)
    if (!entityA || !entityB) {
      return
    }

    if (entityA.has(Owner) && entityA.get(Owner).is(entityB)) {
      contact.setEnabled(false)

      return
    }

    if (entityB.has(Owner) && entityB.get(Owner).is(entityA)) {
      contact.setEnabled(false)

      return
    }

    if (entityA.has(ColliderCallback)) {
      this.applyColliderCallback(entityA, entityB, contact)
    }

    if (entityB.has(ColliderCallback)) {
      this.applyColliderCallback(entityB, entityA, contact)
    }
  }

  private applyColliderCallback(
    entity: Entity,
    otherEntity: Entity,
    contact: Contact
  ): void {
    const colliderCallback = entity.get(ColliderCallback)
    if (colliderCallback.disableContact) {
      contact.setEnabled(false)
    }
    if (colliderCallback.deleteOnContact) {
      entity.destroy()
    }
    const points = contact.getWorldManifold(null)?.points
    const contactPosition = points
      ? Vec2.medium(points.map(({ x, y }) => Vec2.create(x, y)))
      : undefined

    if (colliderCallback.deleteOnContact || colliderCallback.sticky) {
      this.collisionsToMakeSticky.push({
        arrowBody: entity.get(Physic).body,
        contactPosition,
        targetBody: otherEntity.get(Physic).body,
      })
    }

    colliderCallback.callback(
      otherEntity,
      contact,
      contactPosition?.times(this.worldScale)
    )
  }

  protected async onSystemInit(): Promise<void> {
    // this.world.on('begin-contact', (contact) => {})
    // this.world.on('end-contact', (contact) => {})
    this.world.on('pre-solve', this.preSolve.bind(this))
    // this.world.on('post-solve', (contact) => {})
  }

  protected onEntityCreation(entity: Entity): void {
    const physic = entity.get(Physic)
    const {
      fixedRotation,
      friction,
      mass,
      restitution,
      density,
      linearDamping,
      bullet,
      initialLinearVelocity,
      gravityScale,
      interactWithWorld,
      type,
    } = physic
    const {
      size: { x: width, y: height },
      position,
      rotation,
    } = entity.get(Transform)
    const body = this.world.createBody({
      bullet,
      fixedRotation,
      gravityScale,
      linearDamping,
      type,
    })

    const shapes = [
      ...physic.polygons.map((polygon) =>
        Polygon(
          polygon.map(({ x, y }) =>
            PlankVec2(x / this.worldScale, y / this.worldScale)
          )
        )
      ),
      ...physic.ellipses.map((ellipse) => Circle(ellipse / this.worldScale)),
    ]

    if (shapes.length <= 0) {
      shapes.push(
        Box(
          (physic?.size?.x ?? width) / 2 / this.worldScale,
          (physic?.size?.y ?? height) / 2 / this.worldScale
        )
      )
    }

    shapes.forEach((shape) => {
      body.createFixture({
        density,
        filterCategoryBits: parseInt('010', 2),
        filterMaskBits: interactWithWorld ? undefined : IGNORED_BY_WORLD,
        friction,
        restitution,
        shape,
      })
    })

    // now we place the body in the world
    body.setPosition(
      PlankVec2(
        (position.x + physic.offset.x) / this.worldScale,
        (position.y + physic.offset.y) / this.worldScale
      )
    )

    body.setAngle(rotation)

    // time to set mass information
    body.setMassData({
      I: 1,
      center: PlankVec2(),
      mass,
    })

    body.setLinearVelocity(
      PlankVec2(initialLinearVelocity.x, initialLinearVelocity.y)
    )

    body.setUserData({ entityId: entity._id })

    if (type !== PhysicType.STATIC) {
      position.observe((newPos: Vec2) => {
        body.setPosition(
          PlankVec2(
            (newPos.x + physic.offset.x) / this.worldScale,
            (newPos.y + physic.offset.y) / this.worldScale
          )
        )
      })
    }

    physic.body = body
  }

  protected onEntityDestruction(entity: Entity): void {
    if (!entity.get(Physic)) {
      return
    }
    const physic = entity.get(Physic)
    this.world.destroyBody(physic.body)
  }

  public update(elapsedTimeInSeconds: number): void {
    let physic = null
    let transform = null

    this.world.step(elapsedTimeInSeconds)
    this.world.clearForces()

    for (let b = this.world.getBodyList(); b; b = b.getNext()) {
      // get body position
      const bodyPosition = b.getPosition()

      // get body angle, in radians
      const bodyAngle = b.getAngle()

      // get body user data, the ecs object
      const { entityId } = b.getUserData() as EntityBodyData

      const entity = this.ecs.entity(entityId)

      if (!entity) {
        continue
      }

      transform = entity.get(Transform)
      physic = entity.get(Physic)

      transform.position.set(
        bodyPosition.x * this.worldScale - physic.offset.x,
        bodyPosition.y * this.worldScale - physic.offset.y
      )
      transform.rotation = bodyAngle
    }

    while (this.collisionsToMakeSticky.length > 0) {
      const stickyInfo = this.collisionsToMakeSticky.shift()
      if (stickyInfo) {
        this.stick(stickyInfo)
      }
    }
  }

  public query(
    point: Vec2,
    onFound: (entity: Entity) => boolean,
    continueToSearch = false
  ): void {
    const plankPoint = PlankVec2(point.times(1 / this.worldScale))

    this.world.queryAABB(AABB(plankPoint, plankPoint), (fixture) => {
      const body = fixture.getBody()
      const { entityId } = body.getUserData() as EntityBodyData
      const entity = this.ecs.entity(entityId)

      if (entity) {
        return onFound(entity) ?? continueToSearch
      }

      return continueToSearch // Return true to continue the query.
    })
  }

  private stick(si: StickyInfo): void {
    if (si.contactPosition) {
      si.arrowBody.setPosition(
        PlankVec2(si.contactPosition.x, si.contactPosition.y)
      )
    }
    const worldCoordsAnchorPoint = si.arrowBody.getWorldPoint(PlankVec2(0, 0))

    this.world.createJoint(
      WeldJoint({
        bodyA: si.targetBody,
        bodyB: si.arrowBody,
        localAnchorA: si.targetBody.getLocalPoint(worldCoordsAnchorPoint),
        localAnchorB: si.arrowBody.getLocalPoint(worldCoordsAnchorPoint),
        localAxisA: PlankVec2(0, 0),
        referenceAngle: si.arrowBody.getAngle() - si.targetBody.getAngle(),
      })
    )
  }
}
