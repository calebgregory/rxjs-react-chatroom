import React, { useState } from 'react'
import { useSubscription } from 'observable-hooks'
import { Message } from '../message/message'
import { UserRoomService } from '../services/user-room'

interface Props {
  service: UserRoomService
}

export function UserRoom({ service }: Props) {
  const [ messages, setMessages ] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const handleSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault()

    service.send(input)
    setInput('')
  }

  useSubscription(service.incoming$, (message) => setMessages([...messages, message]))

  return (
    <div>
      <h1>{service.room}</h1>
      <ul>
        {messages.map((msg) => {
          switch (msg.type) {
            case 'JOINED':
              return <li><strong>{msg.user} joined</strong></li>
            case 'LEFT':
              return <li><strong>{msg.user} left</strong></li>
            case 'COMM':
              return <li><strong>{msg.user}</strong>: {msg.data.text}</li>
            case 'UNKNOWN':
            default:
              return <li><i>({msg})</i></li>
          }
        })}
        <li>
          <form onSubmit={handleSubmit}>
            &gt;
            {' '}
            <input type="text" onChange={(evt) => { setInput(evt.target.value) }} value={input} />
            <span style={{fontSize: 10, marginLeft: '5px'}}><i><code>Enter</code> key sends</i></span>
          </form>
        </li>
      </ul>
    </div>
  )
}