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
})
