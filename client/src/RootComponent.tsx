import React from 'react'
import { AppProvider } from 'src/contexts/AppContext'
import { Rooms } from 'src/components/Rooms'
import { Login } from 'src/components/Login'

export function RootComponent() {
  return (
    <AppProvider>
      <Rooms />
      <Login />
    </AppProvider>
  )
}
