const COLORS = {
  background: {
    primary: '#0D0D0D',
    secondary: '#1A1A1A',
    tertiary: '#262626',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A3A3A3',
    tertiary: '#737373',
    inverse: '#0D0D0D',
  },
  accent: {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    secondary: '#8B5CF6',
  },
  border: {
    primary: '#404040',
    secondary: '#525252',
    focus: '#3B82F6',
  },
  status: {
    error: '#EF4444',
    errorBackground: '#450A0A',
    success: '#22C55E',
    successBackground: '#052E16',
    warning: '#F59E0B',
    warningBackground: '#422006',
  },
  button: {
    primary: '#3B82F6',
    primaryPressed: '#1D4ED8',
    secondary: '#262626',
    secondaryPressed: '#404040',
    disabled: '#404040',
    google: '#FFFFFF',
    googlePressed: '#E5E5E5',
  },
} as const

export { COLORS }
