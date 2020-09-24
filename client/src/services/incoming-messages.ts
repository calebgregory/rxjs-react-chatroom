import { Observable, from, merge } from 'rxjs'
import { Service } from 'src/util/service'
import { filter, map, scan, mergeMap, tap } from 'rxjs/operators'
import { CommMessage, JoinedMessage, LeftMessage, Message } from 'src/message/message'

import { logger } from 'src/logger'

const log = logger('incoming-messages')

interface Dependencies {
  incoming$: Observable<Message>
}

// https://medium.com/ngconf/filtering-types-with-correct-type-inference-in-rxjs-f4edf064880d
export function filterMessageType<MessageType>(messageType: string) {
  return (source$: Observable<Message>) => source$.pipe(
    filter((msg: Message) => msg.type === messageType),
    map((msg: unknown) => msg as MessageType) // https://github.com/Microsoft/TypeScript/issues/28067
  );
}

export function groupByDataId() {
  return (source$: Observable<CommMessage>) => source$.pipe(
    scan((messages, msg) => {
      // JavaScript Maps preserve insertion order, so message-order will be retained
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
      return messages.set(msg.data.id, msg)
    }, new Map<string, Message>()),
    mergeMap((messages: Map<string, Message>) => from(messages.values()))
  )
}

export function groupByDataId2() {
  return (source$: Observable<CommMessage>) => {
    let messagesByDataId = new Map()
    return new Observable((observer) => {
      const srcSubscription = source$.subscribe({
        next(msg: CommMessage) {
          messagesByDataId.set(msg.data.id, msg)
          observer.next(msg)
        },
        error(err) {
          observer.error(err)
        },
        complete() {
          observer.complete()
        }
      })
      return () => {
        srcSubscription.unsubscribe()
        messagesByDataId = new Map()
      }
    })
  }
}

export class IncomingMessages extends Service {
  messages$: Observable<Message[]>

  constructor({ incoming$ }: Dependencies) {
    super()

    const _joinMessage$: Observable<JoinedMessage> = incoming$.pipe(filterMessageType<JoinedMessage>('JOINED'))
    const _leftMessage$: Observable<LeftMessage> = incoming$.pipe(filterMessageType<LeftMessage>('LEFT'))

    const _commMessage$: Observable<CommMessage> = incoming$.pipe(filterMessageType<CommMessage>('COMM'))
    // const _commMessages$ = _commMessage$.pipe(
    //   groupByDataId()
    // )

    this.messages$ = merge(_joinMessage$, _commMessage$, _leftMessage$)
      .pipe(
        tap((message: Message) => log.info('message', { message })),
        scan((acc: Message[], curr: Message) => [...acc, curr], []),
        tap((messages: Message[]) => log.info('messages', { messages }))
      )
  }
}