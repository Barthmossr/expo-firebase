import React from 'react'
import { render } from '@testing-library/react-native'
import { App } from '@/app'
import { useTelemetry } from '@/hooks/telemetry'

jest.mock('@/hooks/telemetry')

const mockUseTelemetry = useTelemetry as jest.MockedFunction<
  typeof useTelemetry
>

describe('App', () => {
  beforeEach(() => {
    mockUseTelemetry.mockReturnValue({
      ready: true,
      triggerCrash: jest.fn(),
    })
  })

  it('should render without crashing', () => {
    const { getByTestId } = render(<App />)
    expect(getByTestId('welcome-message')).toBeTruthy()
  })

  it('should render StatusBar component', () => {
    const { UNSAFE_root } = render(<App />)
    expect(UNSAFE_root).toBeTruthy()
  })

  it('should display yes when telemetry is ready', () => {
    mockUseTelemetry.mockReturnValue({
      ready: true,
      triggerCrash: jest.fn(),
    })
    const { getByText } = render(<App />)
    expect(getByText('Telemetry ready: yes')).toBeTruthy()
  })
})
