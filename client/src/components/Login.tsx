import React, { useContext, useState } from 'react'
import { AppContext } from '../contexts/AppContext'

interface Props {}

export function Login(props: Props) {
  const { userRoomManager } = useContext(AppContext)
  const [roomName, setRoomName] = useState('')
  const [userName, setUserName] = useState('')

  const handleSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault() // prevent refresh
    userRoomManager.addRoom({ user: userName, room: roomName })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="User Name"
        value={userName}
        onChange={(evt) => setUserName(evt.target.value)}
      />
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(evt) => setRoomName(evt.target.value)}
      />
      <button onClick={handleSubmit}>
        Enter Room
      </button>
    </form>
  )
}