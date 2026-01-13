import { StyleSheet } from 'react-native'
import { SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/theme'

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    ...TYPOGRAPHY.button,
  },
})

export { styles }
