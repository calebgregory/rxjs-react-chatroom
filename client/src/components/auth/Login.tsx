import React from 'react'
import { useObservableState } from 'observable-hooks'
import { pluckEventTargetValue } from 'src/observables/helpers'
import { authenticateUser } from 'src/services/cognito-auth'

interface Props {}

export function getIsFormValid(username: string, password: string): boolean {
  return Boolean(username && password)
}

export function Login(_: Props) {
  const [username, onUsernameChange] = useObservableState(pluckEventTargetValue(), '')
  const [password, onPasswordChange] = useObservableState(pluckEventTargetValue(), '')

  const isFormValid = getIsFormValid(username, password)

  const handleSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault() // prevent refresh
    if (!isFormValid) {
      return
    }

    authenticateUser({ username, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Username
        </label>
        <br />
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={onUsernameChange}
        />
        <label>
          Password
        </label>
        <br />
        <input
          type="password"
          placeholder="<your password>"
          value={password}
          onChange={onPasswordChange}
        />
      </div>
      <div>
        <button onClick={handleSubmit} disabled={!isFormValid}>
          Login
        </button>
      </div>
    </form>
  )
}