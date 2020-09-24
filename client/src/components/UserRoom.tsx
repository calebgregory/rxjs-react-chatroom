import React from 'react'
import { UserRoomService } from 'src/services/user-room'
import { Messages } from 'src/components/Messages'
import { Prompt } from 'src/components/Prompt'

interface Props {
  service: UserRoomService
}

export function UserRoom({ service }: Props) {
  return (
    <div>
      <h1>{service.room}</h1>
      <Messages src$={service.incomingMessages.messages$} />
      <Prompt progressText$={service.outgoingMessages.progressText$} send$={service.outgoingMessages.completeSignal$} />
    </div>
  )
}