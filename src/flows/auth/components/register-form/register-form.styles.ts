import { StyleSheet } from 'react-native'
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme'

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  passwordHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.lg,
  },
  apiError: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.status.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
})

export { styles }
