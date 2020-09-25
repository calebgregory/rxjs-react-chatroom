import React from 'react'
import { AppProvider } from 'src/contexts/AppContext'
import { Rooms } from 'src/components/Rooms'
import { Login } from 'src/components/Login'
import { Register } from 'src/components/auth/Register'
import { ConfirmRegistration } from 'src/components/auth/ConfirmRegistration'

export function RootComponent() {
  return (
    <AppProvider>
      <Rooms />
      <Login />
      <Register />
      <ConfirmRegistration />
    </AppProvider>
  )
}
