import { Image } from 'react-native'
import logoSource from '@assets/logo.png'
import type { LogoProps, LogoSize } from './logo.types'

const LOGO_SIZES: Record<LogoSize, { width: number; height: number }> = {
  small: { width: 48, height: 48 },
  medium: { width: 72, height: 72 },
  large: { width: 96, height: 96 },
}

const Logo = (props: LogoProps): React.ReactElement => {
  const { size = 'medium' } = props
  const dimensions = LOGO_SIZES[size]

  return (
    <Image
      source={logoSource}
      style={dimensions}
      resizeMode="contain"
      accessibilityLabel="App logo"
    />
  )
}

export { Logo, LOGO_SIZES }
