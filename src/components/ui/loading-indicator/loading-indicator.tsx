import { View, Text, ActivityIndicator } from 'react-native'
import { COLORS } from '@/theme'
import type { LoadingIndicatorProps } from './loading-indicator.types'
import { styles } from './loading-indicator.styles'

const LoadingIndicator = (props: LoadingIndicatorProps): React.ReactElement => {
  const { size = 'large', text } = props

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={COLORS.accent.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  )
}

export { LoadingIndicator }
