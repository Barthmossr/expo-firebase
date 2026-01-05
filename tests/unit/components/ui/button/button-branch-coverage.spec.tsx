import { getBackgroundColor } from '@/components/ui/button/button'
import { COLORS } from '@/theme'

describe('Button - getBackgroundColor Function Coverage', () => {
  it('should return primary color when not pressed', () => {
    const color = getBackgroundColor('primary', false)
    expect(color).toBe(COLORS.button.primary)
  })
})
