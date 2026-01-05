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
  })
})
