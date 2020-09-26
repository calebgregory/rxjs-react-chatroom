import React from 'react'
import { AppProvider } from 'src/contexts/AppContext'
import { Rooms } from 'src/components/Rooms'
import { AuthContainer } from 'src/components/auth/AuthContainer'

export function RootComponent() {
  return (
    <AppProvider>
      <Rooms />
      <AuthContainer />
    </AppProvider>
  )
}
