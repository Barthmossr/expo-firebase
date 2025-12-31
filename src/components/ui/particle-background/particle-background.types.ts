type ParticleConfig = {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

type ParticleBackgroundProps = {
  particleCount?: number
  color?: string
}

export type { ParticleConfig, ParticleBackgroundProps }
