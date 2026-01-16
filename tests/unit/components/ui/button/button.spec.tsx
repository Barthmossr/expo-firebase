import { render, fireEvent } from '@testing-library/react-native'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  describe('rendering', () => {
    it('should render button with title', () => {
      const { getByText } = render(
        <Button title="Click Me" onPress={jest.fn()} />,
      )

      expect(getByText('Click Me')).toBeDefined()
    })

    it('should render loading indicator when loading', () => {
      const { queryByText, UNSAFE_getByType } = render(
        <Button title="Click Me" onPress={jest.fn()} loading />,
      )

      expect(queryByText('Click Me')).toBeNull()
      const ActivityIndicator = require('react-native').ActivityIndicator
      expect(UNSAFE_getByType(ActivityIndicator)).toBeDefined()
    })

    it('should render primary variant by default', () => {
      const { getByText } = render(
        <Button title="Click Me" onPress={jest.fn()} />,
      )

      const button = getByText('Click Me').parent?.parent
      expect(button).toBeDefined()
    })

    it('should render secondary variant', () => {
      const { getByText } = render(
        <Button title="Click Me" onPress={jest.fn()} variant="secondary" />,
      )

      expect(getByText('Click Me')).toBeDefined()
    })

    it('should render google variant', () => {
      const { getByText } = render(
        <Button
          title="Sign in with Google"
          onPress={jest.fn()}
          variant="google"
        />,
      )

      expect(getByText('Sign in with Google')).toBeDefined()
    })
  })

  describe('onPress', () => {
    it('should call onPress when button is pressed', () => {
      const onPress = jest.fn()
      const { getByText } = render(
        <Button title="Click Me" onPress={onPress} />,
      )

      fireEvent.press(getByText('Click Me'))

      expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('should not call onPress when button is disabled', () => {
      const onPress = jest.fn()
      const { getByText } = render(
        <Button title="Click Me" onPress={onPress} disabled />,
      )

      fireEvent.press(getByText('Click Me'))

      expect(onPress).not.toHaveBeenCalled()
    })

    it('should not call onPress when button is loading', () => {
      const onPress = jest.fn()
      render(<Button title="Click Me" onPress={onPress} loading />)

      expect(onPress).not.toHaveBeenCalled()
    })
  })

  describe('disabled state', () => {
    it('should render disabled button', () => {
      const { getByText } = render(
        <Button title="Click Me" onPress={jest.fn()} disabled />,
      )

      const button = getByText('Click Me').parent?.parent
      expect(button).toBeDefined()
      expect(button?.props['accessibilityState']?.disabled).toBe(true)
    })

    it('should not be disabled by default', () => {
      const { getByText } = render(
        <Button title="Click Me" onPress={jest.fn()} />,
      )

      const button = getByText('Click Me').parent?.parent
      expect(button?.props['accessibilityState']?.disabled).toBeFalsy()
    })
  })

  describe('loading state', () => {
    it('should not show loading by default', () => {
      const { getByText, UNSAFE_queryByType } = render(
        <Button title="Click Me" onPress={jest.fn()} />,
      )

      expect(getByText('Click Me')).toBeDefined()
      const ActivityIndicator = require('react-native').ActivityIndicator
      expect(UNSAFE_queryByType(ActivityIndicator)).toBeNull()
    })

    it('should show loading indicator when loading', () => {
      const { UNSAFE_getByType } = render(
        <Button title="Click Me" onPress={jest.fn()} loading />,
      )

      const ActivityIndicator = require('react-native').ActivityIndicator
      expect(UNSAFE_getByType(ActivityIndicator)).toBeDefined()
    })
  })

  describe('variants', () => {
    it('should apply primary variant styling', () => {
      const { getByText } = render(
        <Button title="Primary" onPress={jest.fn()} variant="primary" />,
      )

      const text = getByText('Primary')
      expect(text).toBeDefined()
    })

    it('should apply secondary variant styling', () => {
      const { getByText } = render(
        <Button title="Secondary" onPress={jest.fn()} variant="secondary" />,
      )

      const text = getByText('Secondary')
      expect(text).toBeDefined()
    })

    it('should apply google variant styling', () => {
      const { getByText } = render(
        <Button title="Google" onPress={jest.fn()} variant="google" />,
      )

      const text = getByText('Google')
      expect(text).toBeDefined()
    })
  })
})
