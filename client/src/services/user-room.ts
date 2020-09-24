import { Observable, Subject, Subscription } from 'rxjs'
import { map, share } from 'rxjs/operators'
import { ObservableWebSocket } from 'src/util/observable-websocket'
import { Message, ProgressMessage, CompleteMessage } from 'src/message/message'
import { parseMessageData } from 'src/message/parsers/oatpp-ws-messages'
import { config } from 'src/config'
import { OutgoingMessages } from 'src/services/outgoing-messages'
import { IncomingMessages } from 'src/services/incoming-messages'

export interface UserRoom {
  user: string,
  room: string
}

export function getId({ user, room }: UserRoom): string {
  return `ROOM_${room}---USER_${user}`
}

export function fromId(id: string): UserRoom {
  const [room, user] = /^ROOM_(.+)---USER_(.+)$/.exec(id)?.slice(1) || []
  return { user, room }
}

export class UserRoomService {
  id: string
  user: string
  room: string
  ws: ObservableWebSocket
  incoming$: Observable<Message>
  outgoing$: Subject<ProgressMessage | CompleteMessage> = new Subject()
  $subscriptions: Set<Subscription> = new Set()

  incomingMessages: IncomingMessages
  outgoingMessages = new OutgoingMessages()

  constructor({ user, room }: UserRoom) {
    const url = `${config.wsUrl}/${room}/?nickname=${user}`

    this.id = getId({ user, room })
    this.user = user
    this.room = room

    this.ws = new ObservableWebSocket(url)

    this.incoming$ = this.ws.incoming$.pipe(
      map((event: MessageEvent) => parseMessageData(event.data)),
      share()
    )

    this.incomingMessages = new IncomingMessages({ incoming$: this.incoming$ })

    this.$subscriptions.add(this.outgoingMessages.progressMsg$.subscribe(this.outgoing$))
    this.$subscriptions.add(this.outgoingMessages.completeMsg$.subscribe(this.outgoing$))
    this.$subscriptions.add(this.outgoing$.subscribe((msg) => { this.send(msg) }))
  }

  send(msg: ProgressMessage | CompleteMessage) {
    this.ws.send(msg)
  }

  destroy() {
    this.ws.close()
    this.$subscriptions.forEach((subscription) => { subscription.unsubscribe() })
    this.outgoingMessages.destroy()
  }
}