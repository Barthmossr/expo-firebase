import React from 'react'
import { render } from '@testing-library/react-native'
import App from '@/App'

describe('App', () => {
  it('should render without crashing', () => {
    const { getByTestId } = render(<App />)
    expect(getByTestId('welcome-message')).toBeTruthy()
  })

  it('should render StatusBar component', () => {
    const { UNSAFE_root } = render(<App />)
    expect(UNSAFE_root).toBeTruthy()
  })
})
