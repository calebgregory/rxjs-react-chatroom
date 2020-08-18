import React, { useContext } from 'react'
import { useObservableState } from 'observable-hooks'
import { AppContext } from '../contexts/AppContext'
import { UserRoom } from './UserRoom'
import { UserRoomService } from '../services/user-room'

interface Props {}

export function Rooms(props: Props) {
  const { userRoomManager } = useContext(AppContext)

  const userRooms = useObservableState<UserRoomService[]>(userRoomManager.rooms$, [])
  console.debug({ userRooms })

  return <>{userRooms.map((service) => <UserRoom key={service.id} service={service} />)}</>
}