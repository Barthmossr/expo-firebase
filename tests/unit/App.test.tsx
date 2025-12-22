import React from 'react'
import { render } from '@testing-library/react-native'
import App from '@/App'

describe('App', () => {
  it('should render without crashing', () => {
    const { getByText } = render(<App />)
    expect(
      getByText(/Open up App.tsx to start working on your app!/i),
    ).toBeTruthy()
  })

  it('should render StatusBar component', () => {
    const { UNSAFE_root } = render(<App />)
    expect(UNSAFE_root).toBeTruthy()
  })
})
