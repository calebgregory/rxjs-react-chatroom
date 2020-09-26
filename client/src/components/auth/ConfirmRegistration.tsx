import React from 'react'
import { useObservableState } from 'observable-hooks'
import { pluckEventTargetValue } from 'src/observables/helpers'
import { confirmRegistration } from 'src/services/cognito-auth'

interface Props {}

export function getIsFormValid(confirmationCode: string): boolean {
  return Boolean(confirmationCode)
}

export function ConfirmRegistration(_: Props) {
  const [username, onUsernameChange] = useObservableState(pluckEventTargetValue(), '')
  const [confirmationCode, onConfirmationCodeChange] = useObservableState(pluckEventTargetValue(), '')

  const isFormValid = getIsFormValid(confirmationCode)

  const handleSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault() // prevent refresh
    if (!isFormValid) {
      return
    }

    confirmRegistration(username, confirmationCode)
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
      </div>
      <div>
        <label>
          Confirmation Code (this was emailed to you. you may need to
          look in your spam folder. whenever you find it, copy and paste it
          here)
        </label>
        <br />
        <input
          type="text"
          placeholder="804823"
          value={confirmationCode}
          onChange={onConfirmationCodeChange}
        />
      </div>
      <div>
        <button onClick={handleSubmit} disabled={!isFormValid}>
          Confirm Registration
        </button>
      </div>
    </form>
  )
}