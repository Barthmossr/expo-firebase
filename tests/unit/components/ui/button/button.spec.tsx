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
  })
})
