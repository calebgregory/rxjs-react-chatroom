import React from 'react'
import { AppProvider } from './contexts/AppContext'
import { Rooms } from './components/Rooms'
import { Login } from './components/Login'

export function RootComponent() {
  return (
    <AppProvider>
      <Rooms />
      <Login />
    </AppProvider>
  )
}
