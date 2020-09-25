import React, { useContext } from 'react'
import { useObservableState } from 'observable-hooks'
import { AppContext } from 'src/contexts/AppContext'
import { pluckEventTargetValue } from 'src/observables/helpers'

interface Props {}

export function getIsEnterButtonDisabled(roomName: string, userName: string): boolean {
  return !(roomName && userName)
}

export function LoginRoom(_: Props) {
  const { userRoomManager } = useContext(AppContext)
  const [roomName, onRoomNameChange] = useObservableState(pluckEventTargetValue(), '')
  const [userName, onUserNameChange] = useObservableState(pluckEventTargetValue(), '')

  const handleSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault() // prevent refresh
    userRoomManager.addRoom({ user: userName, room: roomName })
  }

  const isEnterButtonDisabled = getIsEnterButtonDisabled(roomName, userName)

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="User Name"
        value={userName}
        onChange={onUserNameChange}
      />
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={onRoomNameChange}
      />
      <button onClick={handleSubmit} disabled={isEnterButtonDisabled}>
        Enter Room
      </button>
    </form>
  )
}