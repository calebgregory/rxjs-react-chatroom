import React, { useRef, useState, ChangeEvent, useEffect } from 'react'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { useSubscription, useObservable, useObservableState } from 'observable-hooks'
import { Message, ProgressMessage, CompleteMessage } from 'src/message/message'
import { UserRoomService } from 'src/services/user-room'

interface Props {
  service: UserRoomService
}

const makeId = () => `msg-${Date.now()}-${Math.random().toPrecision(7)}`

export function UserRoom({ service }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  const [id, setId] = useState<string>(makeId())
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

  const progress$ = useObservable(
    (input$) => input$.pipe(
      map(([text]) => ({ type: 'PROGRESS', text, time: Date.now(), id, } as ProgressMessage))
    ),
    [input]
  )

  const handleSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault()

    const msg: CompleteMessage = { type: 'COMPLETE', text: input, time: Date.now(), id }
    service.send(msg)
    onChange('')
    setId(makeId())
  }

  useSubscription(service.incoming$, (message) => setMessages([...messages, message]))
  useEffect(() => {
    // pipe PROGRESS messages -> outgoing$ Subject on Service
    const subscription = progress$.subscribe(service.outgoing$)
    return () => { subscription.unsubscribe() }
  }, [progress$, service.outgoing$])

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