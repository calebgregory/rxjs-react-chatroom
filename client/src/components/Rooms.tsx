import React, { useContext } from 'react'
import { useObservableState } from 'observable-hooks'
import { AppContext } from 'src/contexts/AppContext'
import { UserRoom } from 'src/components/UserRoom'
import { UserRoomService } from 'src/services/user-room'

interface Props {}

export function Rooms(props: Props) {
  const { userRoomManager } = useContext(AppContext)

  const userRooms = useObservableState<UserRoomService[]>(userRoomManager.rooms$, [])

  return <>{userRooms.map((service) => <UserRoom key={service.id} service={service} />)}</>
}