import ParticleEmitter, {
  BufferContent,
} from '../../../components/ParticleEmitter'

const getParticleEmitterBuffers = (
  particleEmitter: ParticleEmitter,
  name: string
): BufferContent => {
  const buffers = particleEmitter.buffers.get(name)

  if (!buffers) {
    throw new Error(
      `buffers for attribute ${name} not found in particleEmitter`
    )
  }

  return buffers
}

export default getParticleEmitterBuffers
