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

    it('should not render error when no error', () => {
      const { queryByText } = render(
        <TextInput value="" onChangeText={jest.fn()} />,
      )

      expect(queryByText(/required|invalid|error/i)).toBeNull()
    })
  })

  describe('value changes', () => {
    it('should call onChangeText when text changes', () => {
      const onChangeText = jest.fn()
      const { getByTestId } = render(
        <TextInput testID="text-input" value="" onChangeText={onChangeText} />,
      )

      fireEvent.changeText(getByTestId('text-input'), 'test@example.com')

      expect(onChangeText).toHaveBeenCalledWith('test@example.com')
    })

    it('should display value', () => {
      const { getByTestId } = render(
        <TextInput
          testID="text-input"
          value="test@example.com"
          onChangeText={jest.fn()}
        />,
      )

      const input = getByTestId('text-input')
      expect(input.props['value']).toBe('test@example.com')
    })
  })

  describe('secure text entry', () => {
    it('should hide password by default when secureTextEntry is true', () => {
      const { getByTestId } = render(
        <TextInput
          testID="text-input"
          secureTextEntry
          value="password123"
          onChangeText={jest.fn()}
        />,
      )

      const input = getByTestId('text-input')
      expect(input.props['secureTextEntry']).toBe(true)
    })

    it('should show Show button when secureTextEntry is true', () => {
      const { getByText } = render(
        <TextInput
          testID="text-input"
          secureTextEntry
          value="password123"
          onChangeText={jest.fn()}
        />,
      )

      expect(getByText('Show')).toBeDefined()
    })

    it('should toggle password visibility when Show/Hide is pressed', () => {
      const { getByText, getByTestId } = render(
        <TextInput
          testID="text-input"
          secureTextEntry
          value="password123"
          onChangeText={jest.fn()}
        />,
      )

      const input = getByTestId('text-input')
      expect(input.props['secureTextEntry']).toBe(true)

      fireEvent.press(getByText('Show'))
      expect(input.props['secureTextEntry']).toBe(false)
      expect(getByText('Hide')).toBeDefined()

      fireEvent.press(getByText('Hide'))
      expect(input.props['secureTextEntry']).toBe(true)
      expect(getByText('Show')).toBeDefined()
    })
  })
})
