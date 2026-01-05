import { getBackgroundColor } from '@/components/ui/button/button'
import { COLORS } from '@/theme'

describe('Button - getBackgroundColor Function Coverage', () => {
  it('should return primary color when not pressed', () => {
    const color = getBackgroundColor('primary', false)
    expect(color).toBe(COLORS.button.primary)
  })

  it('should return primaryPressed color when pressed', () => {
    const color = getBackgroundColor('primary', true)
    expect(color).toBe(COLORS.button.primaryPressed)
  })

  it('should return secondary color when not pressed', () => {
    const color = getBackgroundColor('secondary', false)
    expect(color).toBe(COLORS.button.secondary)
  })

  it('should return secondaryPressed color when pressed', () => {
    const color = getBackgroundColor('secondary', true)
    expect(color).toBe(COLORS.button.secondaryPressed)
  })

  it('should return google color when not pressed', () => {
    const color = getBackgroundColor('google', false)
    expect(color).toBe(COLORS.button.google)
  })

  it('should return googlePressed color when pressed', () => {
    const color = getBackgroundColor('google', true)
    expect(color).toBe(COLORS.button.googlePressed)
  })
})
