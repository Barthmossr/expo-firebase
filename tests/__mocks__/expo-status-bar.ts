import React from 'react'

export const StatusBar = ({
  style,
}: {
  style?: string
}): React.ReactElement => {
  return React.createElement('StatusBar', { style })
}

export default {
  StatusBar,
}
