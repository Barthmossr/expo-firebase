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

    it('should render with label', () => {
      const { getByText, getByTestId } = render(
        <TextInput
          testID="text-input"
          label="Email"
          value=""
          onChangeText={jest.fn()}
        />,
      )

      expect(getByText('Email')).toBeDefined()
      expect(getByTestId('text-input')).toBeDefined()
    })
  })
})
