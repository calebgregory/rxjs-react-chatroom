import { Observable, merge } from 'rxjs'
import { Service } from 'src/util/service'
import { filter, map, scan } from 'rxjs/operators'
import { CommMessage, JoinedMessage, LeftMessage, Message } from 'src/message/message'

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

// @@TODO: name this better
export function groupByDataId() {
  return (source$: Observable<Message>) => source$.pipe(
    scan((messages, msg) => {
      // overwrite existing COMM message with new one
      // e.g., [PROGRESS, p] -> [PROGRESS, pr] -> [PROGRESS, pro] -> [COMPLETE, pro]
      if (msg.type === 'COMM') {
        return messages.set(msg.data.id, msg)
      }
      return messages.set(msg.id, msg)
      // because JavaScript Maps preserve insertion order, message-order will be retained
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    }, new Map<string, Message>()),
    map((messages: Map<string, Message>) => Array.from(messages.values()))
  )
}

export class IncomingMessages extends Service {
  messages$: Observable<Message[]>

  constructor({ incoming$ }: Dependencies) {
    super()

    const _joinMessage$: Observable<JoinedMessage> = incoming$.pipe(filterMessageType<JoinedMessage>('JOINED'))
    const _leftMessage$: Observable<LeftMessage> = incoming$.pipe(filterMessageType<LeftMessage>('LEFT'))

    const _commMessage$: Observable<CommMessage> = incoming$.pipe(filterMessageType<CommMessage>('COMM'))

    this.messages$ = merge(_joinMessage$, _commMessage$, _leftMessage$)
      .pipe(
        groupByDataId(),
      )
  }
}