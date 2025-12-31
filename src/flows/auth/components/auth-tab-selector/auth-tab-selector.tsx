import { View, Text, Pressable, StyleSheet } from 'react-native'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/theme'
import type { AuthTab, AuthTabSelectorProps } from './auth-tab-selector.types'

const TABS: { key: AuthTab; label: string }[] = [
  { key: 'login', label: 'Login' },
  { key: 'register', label: 'Register' },
]

const AuthTabSelector = (props: AuthTabSelectorProps): React.ReactElement => {
  const { activeTab, onTabChange } = props

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  activeTab: {
    backgroundColor: COLORS.background.tertiary,
  },
  tabText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.secondary,
  },
  activeTabText: {
    color: COLORS.text.primary,
  },
})

export { AuthTabSelector }
