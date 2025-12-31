type AuthTab = 'login' | 'register' | 'forgot-password'

type AuthTabSelectorProps = {
  activeTab: AuthTab
  onTabChange: (tab: AuthTab) => void
}

export type { AuthTab, AuthTabSelectorProps }
