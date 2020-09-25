import * as R from 'ramda'
import React, { CSSProperties } from 'react'
import { useObservableState } from 'observable-hooks'
import { pluckEventTargetValue } from 'src/observables/helpers'
import { signUp } from 'src/services/cognito-auth'

interface Props {}

export const HAS_DIGIT = 'has digit'
export const HAS_LOWER = 'has lowercase'
export const HAS_UPPER = 'has uppercase'
export const IS_ENOUGH = 'is long enough'

const validations: Map<string, RegExp> = new Map([
  [HAS_DIGIT, /[0-9]+/g],
  [HAS_LOWER, /[a-z]+/g],
  [HAS_UPPER, /[A-Z]+/g],
  [IS_ENOUGH, /^.{12,}/g],
])

export function validQualitiesFromPassword(password: string): Set<string> {
  const qualities = Array.from(validations.entries())
    .filter(([_, regex]) => R.test(regex)(password))
    .map(([quality]) => quality)

  return new Set(qualities)
}

export function getQualitiesStyle(hasQuality: boolean): CSSProperties {
  return {
    fontStyle: 'bold',
    color: hasQuality ? 'green' : 'default',
  }
}

export function getIsFormValid(validQualities: Set<string>, password: string, confirmPassword: string): boolean {
  return validQualities.size === validations.size && password === confirmPassword
}

export function Register(_: Props) {
  const [username, onUsernameChange] = useObservableState(pluckEventTargetValue(), '')
  const [email, onEmailChange] = useObservableState(pluckEventTargetValue(), '')
  const [password, onPasswordChange] = useObservableState(pluckEventTargetValue(), '')
  const [confirmPassword, onConfirmPasswordChange] = useObservableState(pluckEventTargetValue(), '')

  const validQualities = validQualitiesFromPassword(password)
  const isFormValid = getIsFormValid(validQualities, password, confirmPassword)

  const handleSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault() // prevent refresh
    if (!isFormValid) {
      return
    }

    signUp({ username, password, email })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label><br/>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={onUsernameChange}
        />
      </div>
      <div>
        <label>Email</label><br />
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={onEmailChange}
        />
      </div>
      <div>
        <label>Password: must be{' '}
          <span style={getQualitiesStyle(validQualities.has(IS_ENOUGH))}>&ge; 12 characters</span>,{' '}
          include{' '}
          <span style={getQualitiesStyle(validQualities.has(HAS_UPPER))}>1. capital letter</span>,{' '}
          <span style={getQualitiesStyle(validQualities.has(HAS_LOWER))}>2. lowercase letter</span>,{' '}
          <span style={getQualitiesStyle(validQualities.has(HAS_DIGIT))}>3. a number</span>
        </label><br/>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={onPasswordChange}
        />
      </div>
      <div>
        <label>Confirm Password</label><br/>
        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
        />
      </div>
      <div>
        <button onClick={handleSubmit} disabled={!isFormValid}>
          Register
        </button>
      </div>
    </form>
  )
}