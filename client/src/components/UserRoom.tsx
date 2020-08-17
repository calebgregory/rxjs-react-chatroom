import React, { useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { logger } from '../logger'

const log = logger('components/UserRoom')

interface Props {
  id: string
}

export function UserRoom({ id }: Props) {
  const { userRoomManager } = useContext(AppContext)

  const userRoom = userRoomManager.getRoom(id)
  log.info({ userRoom })

  if (userRoom) {
    return (
      <div>
        {userRoom.user}, {userRoom.room}
      </div>
    )
  }

  return <div>No user room with id = <pre>{id}</pre></div>
}