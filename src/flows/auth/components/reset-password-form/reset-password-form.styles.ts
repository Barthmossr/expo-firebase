import { StyleSheet } from 'react-native'
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme'

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  emailText: {
    ...TYPOGRAPHY.body,
    color: COLORS.accent.primary,
    marginBottom: SPACING.lg,
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
  cancelButton: {
    alignSelf: 'center',
    marginTop: SPACING.lg,
  },
  cancelButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.accent.primary,
  },
  successTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  successMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
})

export { styles }
