import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme'
import type { LoadingIndicatorProps } from './loading-indicator.types'

const LoadingIndicator = (props: LoadingIndicatorProps): React.ReactElement => {
  const { size = 'large', text } = props

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={COLORS.accent.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.primary,
  },
  text: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
  },
})

export { LoadingIndicator }
