import React, { useContext } from 'react'
import { AppContext } from 'src/contexts/AppContext'
import { useObservableState } from 'observable-hooks'
import { Route, NavigationAction, INITIAL_NAV } from 'src/controllers/auth-router'

interface Props {
  label: string,
  disabled: boolean,
  onClick: () => void,
}
function Link({ label, disabled, onClick }: Props) {
  return <button onClick={onClick} disabled={disabled}>{ label }</button>
}

const buttons: [Route, string][] = [
  [Route.Login, 'login'],
  [Route.Register, 'register'],
  [Route.ConfirmRegistration, 'confirm registration']
]

export function AuthTabNavigator() {
  const { authRouter } = useContext(AppContext)

  const { route } = useObservableState<NavigationAction>(authRouter.nav$, INITIAL_NAV)

  return (
    <div>
      {buttons.map(([dest, label]) => (
        <Link label={label} onClick={() => authRouter.navigate(dest)} disabled={dest === route} />
      ))}
    </div>
  )
}