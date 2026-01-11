import { StyleSheet } from 'react-native'
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: SPACING.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border.primary,
  },
  dividerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.tertiary,
    marginHorizontal: SPACING.md,
  },
})

export { styles }
