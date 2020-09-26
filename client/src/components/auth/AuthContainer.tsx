import React, { Fragment, createElement, useContext, FC } from 'react'
import { useObservableState } from 'observable-hooks'
import { AppContext } from 'src/contexts/AppContext'
import { Route, NavigationAction, INITIAL_NAV } from 'src/controllers/auth-router'
import { AuthTabNavigator } from 'src/components/auth/AuthTabNavigator'
import { Login } from 'src/components/auth/Login'
import { Register } from 'src/components/auth/Register'
import { ConfirmRegistration } from 'src/components/auth/ConfirmRegistration'

const routes = new Map<Route, FC>([
  [Route.Login, Login],
  [Route.Register, Register],
  [Route.ConfirmRegistration, ConfirmRegistration],
])

export function AuthContainer() {
  const { authRouter } = useContext(AppContext)

  const { route } = useObservableState<NavigationAction>(authRouter.nav$, INITIAL_NAV)

  const Component = routes.get(route)

  return (
    <Fragment>
      {createElement(Component || 'div')}
      <AuthTabNavigator />
    </Fragment>
  )
}