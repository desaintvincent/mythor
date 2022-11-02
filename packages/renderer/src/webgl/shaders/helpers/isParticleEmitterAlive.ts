import ParticleEmitter from '../../../components/ParticleEmitter'

const isParticleEmitterAlive = (particleEmitter: ParticleEmitter): boolean => {
  if (particleEmitter.respawn) {
    return true
  }

  return particleEmitter.age < particleEmitter.minMaxLifeTime.y
}

export default isParticleEmitterAlive
