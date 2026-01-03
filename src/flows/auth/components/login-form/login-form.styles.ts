import { StyleSheet } from 'react-native'
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme'

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.accent.primary,
  },
  apiError: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.status.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
})

export { styles }
