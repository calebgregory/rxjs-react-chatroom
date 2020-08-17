import React, { useContext } from 'react'
import { useObservableState } from 'observable-hooks'
import { AppContext } from '../contexts/AppContext'
import { UserRoom } from './UserRoom'
import { UserRoom as UserRoomType } from '../services/user-room'

interface Props {}

export function Rooms(props: Props) {
  const { userRoomManager } = useContext(AppContext)

  const userRooms = useObservableState<UserRoomType[]>(userRoomManager.rooms$, [])
  console.debug({ userRooms })

  return <>{userRooms.map(({ user, room }) => <UserRoom key={`${room}.${user}}`} user={user} room={room} />)}</>
}