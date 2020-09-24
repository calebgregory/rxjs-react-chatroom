import React from 'react'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { useObservableState } from 'observable-hooks'
import { Message } from 'src/message/message'

interface Props {
  src$: Observable<IterableIterator<Message>>
}

export function Messages({ src$ }: Props) {
  const messages: Message[] = useObservableState(
    src$.pipe(
      map((msgIter: IterableIterator<Message>) => Array.from(msgIter))
    ),
    []
  )

  return (
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
    </ul>
  )
}