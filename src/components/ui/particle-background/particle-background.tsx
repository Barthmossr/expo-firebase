import { useEffect, useRef, useMemo } from 'react'
import { View, Animated, Dimensions, Easing } from 'react-native'
import { COLORS } from '@/theme'
import type {
  ParticleConfig,
  ParticleBackgroundProps,
} from './particle-background.types'
import { styles } from './particle-background.styles'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const generateParticles = (count: number): ParticleConfig[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: Math.random() * SCREEN_WIDTH,
    y: Math.random() * SCREEN_HEIGHT,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.3 + 0.1,
    duration: Math.random() * 4000 + 6000,
    delay: Math.random() * 2000,
  }))
}

type ParticleProps = {
  config: ParticleConfig
  color: string
}

const Particle = ({ config, color }: ParticleProps): React.ReactElement => {
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.timing(progress, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start()
    }, config.delay)

    return () => clearTimeout(timeout)
  }, [progress, config.duration, config.delay])

  const translateY = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -25, 0],
  })

  const translateX = progress.interpolate({
    inputRange: [0, 0.25, 0.75, 1],
    outputRange: [0, 12, -12, 0],
  })

  const animatedOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [config.opacity, config.opacity * 0.4, config.opacity],
  })

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: config.x,
          top: config.y,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: color,
          opacity: animatedOpacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  )
}

const ParticleBackground = (
  props: ParticleBackgroundProps,
): React.ReactElement => {
  const { particleCount = 20, color = COLORS.accent.secondary } = props

  const particles = useMemo(
    () => generateParticles(particleCount),
    [particleCount],
  )

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <Particle key={particle.id} config={particle} color={color} />
      ))}
    </View>
  )
}

export { ParticleBackground }
