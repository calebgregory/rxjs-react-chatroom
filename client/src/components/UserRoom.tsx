import React, { useRef, useState, ChangeEvent, useEffect } from 'react'
import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { useSubscription, useObservable, useObservableCallback, useObservableState } from 'observable-hooks'
import { Message } from 'src/message/message'
import { UserRoomService } from 'src/services/user-room'

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

  const progress$ = useObservable(
    (input$) => input$.pipe(
      map(([x]) => x),
      filter((x) => x.length > 0)
    ),
    [input]
  )

  const [onSubmit, submit$] = useObservableCallback<React.SyntheticEvent<HTMLFormElement>, React.SyntheticEvent<HTMLFormElement>>(
    (event$) => event$
  )

  // @todo: this appending behavior should be done elsewhere
  useSubscription(service.incoming$, (message) => setMessages([...messages, message]))

  // submit events should not refresh the page; cleanup input
  useSubscription(submit$, (event) => { event.preventDefault(); onChange('') })

  // pipe PROGRESS messages to progressText$ Subject
  useEffect(() => {
    const subscription = progress$.subscribe(service.userRoomMessages.progressText$)
    return () => { subscription.unsubscribe() }
  }, [progress$, service.userRoomMessages.progressText$])

  // pipe submit events to completeSignal$ Subject
  useEffect(() => {
    const subscription = submit$.pipe(map(() => null)).subscribe(service.userRoomMessages.completeSignal$)
    return () => { subscription.unsubscribe() }
  }, [submit$, service.userRoomMessages.completeSignal$])

  return (
    <div>
      <h1>{service.room}</h1>
      <ul>
        {messages.map((msg) => {
          switch (msg.type) {
            case 'JOINED':
              return <li key={msg.id}><strong>{msg.user} joined</strong></li>
            case 'LEFT':
              return <li key={msg.id}><strong>{msg.user} left</strong></li>
            case 'COMM':
              if (msg.data.type === 'COMPLETE') {
                return <li key={msg.id}><strong>{msg.user}</strong>: <i>EOM</i></li>
              }
              return <li key={msg.id}><strong>{msg.user}</strong>: {msg.data.text}</li>
            case 'UNKNOWN':
            default:
              return <li key={msg.id}><i>({msg})</i></li>
          }
        })}
        <li>
          <form onSubmit={onSubmit} ref={formRef}>
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