import { AttributeOptions } from '../../Attribute'

export enum ParticleAttributeName {
  AGE_AND_LIFETIME = 'ageAndLifetime',
  POSITION = 'position',
  TORQUE_AND_ROTATION = 'torqueAndRotation',
}

const particleAttributes: Record<
  string,
  Omit<AttributeOptions, 'maxElements'> & { render?: boolean }
> = {
  [ParticleAttributeName.AGE_AND_LIFETIME]: {
    render: true,
    size: 2,
  },
  [ParticleAttributeName.POSITION]: {
    render: true,
    size: 2,
  },
  [ParticleAttributeName.TORQUE_AND_ROTATION]: {
    render: true,
    size: 2,
  },
  velocity: {
    size: 2,
  },
}

export default particleAttributes
