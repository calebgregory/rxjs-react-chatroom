import React, { useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { logger } from '../logger'

const log = logger('components/UserRoom')

interface Props {
  user: string,
  room: string
}

export function UserRoom({ user, room }: Props) {
  const { userRoomManager } = useContext(AppContext)

  const userRoom = userRoomManager.getRoom({ user, room })
  log.debug({ userRoom })

  return (
    <div>
      {user}, {room}
    </div>
  )
}