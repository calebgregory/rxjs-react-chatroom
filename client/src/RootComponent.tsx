import React from 'react'
import { AppProvider } from 'src/contexts/AppContext'
import { Rooms } from 'src/components/Rooms'
import { Register } from 'src/components/auth/Register'
import { ConfirmRegistration } from 'src/components/auth/ConfirmRegistration'
import { Login } from 'src/components/auth/Login'

export function RootComponent() {
  return (
    <AppProvider>
      <Rooms />
      <Register />
      <ConfirmRegistration />
      <Login />
    </AppProvider>
  )
}
