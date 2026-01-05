import { render, fireEvent } from '@testing-library/react-native'
import { TextInput } from '@/components/ui/text-input'

describe('TextInput', () => {
  describe('rendering', () => {
    it('should render text input', () => {
      const { getByTestId } = render(
        <TextInput testID="text-input" value="" onChangeText={jest.fn()} />,
      )

      expect(getByTestId('text-input')).toBeDefined()
    })
  })
})
