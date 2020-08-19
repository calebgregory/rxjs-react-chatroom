import React, { useRef, useState, ChangeEvent } from 'react'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { useSubscription, useObservableState } from 'observable-hooks'
import { Message } from '../message/message'
import { UserRoomService } from '../services/user-room'

interface Props {
  service: UserRoomService
}

export function UserRoom({ service }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [ messages, setMessages ] = useState<Message[]>([])
  const [input, onChange] = useObservableState(
    (evt$: Observable<ChangeEvent<HTMLInputElement> | string>) => (
      evt$.pipe(
        map((evt) => typeof evt === 'string' ?
          evt :
          (evt.target as HTMLInputElement).value)
      )
    ),
    ''
  )
  const handleSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault()

    service.send(input)
    onChange('')
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
          <form onSubmit={handleSubmit} ref={formRef}>
            &gt;
            {' '}
            <input type="text" onChange={onChange} value={input} />
            <span style={{fontSize: 10, marginLeft: '5px'}}><i><code>Enter</code> key sends</i></span>
          </form>
        </li>
      </ul>
    </div>
  )
}