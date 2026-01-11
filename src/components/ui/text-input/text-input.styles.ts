import { StyleSheet } from 'react-native'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/theme'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.label,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.md,
  },
  toggle: {
    paddingHorizontal: SPACING.md,
  },
  toggleText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.accent.primary,
  },
  error: {
    ...TYPOGRAPHY.caption,
    color: COLORS.status.error,
    marginTop: SPACING.xs,
  },
})

export { styles }
