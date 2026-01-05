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

    it('should render without label', () => {
      const { queryByText, getByTestId } = render(
        <TextInput testID="text-input" value="" onChangeText={jest.fn()} />,
      )

      expect(queryByText(/Email|Password|Name/)).toBeNull()
      expect(getByTestId('text-input')).toBeDefined()
    })

    it('should render placeholder', () => {
      const { getByPlaceholderText } = render(
        <TextInput
          placeholder="Enter email"
          value=""
          onChangeText={jest.fn()}
        />,
      )

      expect(getByPlaceholderText('Enter email')).toBeDefined()
    })

    it('should render error message', () => {
      const { getByText } = render(
        <TextInput
          error="Email is required"
          value=""
          onChangeText={jest.fn()}
        />,
      )

      expect(getByText('Email is required')).toBeDefined()
    })
  })
})
