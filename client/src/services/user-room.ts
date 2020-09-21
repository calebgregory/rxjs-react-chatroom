import { Observable, Subject, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { ObservableWebSocket } from 'src/util/observable-websocket'
import { Message, ProgressMessage, CompleteMessage } from 'src/message/message'
import { parseMessageData } from 'src/message/parsers/oatpp-ws-messages'
import { config } from 'src/config'

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

  constructor({ user, room }: UserRoom) {
    const url = `${config.wsUrl}/${room}/?nickname=${user}`

    this.id = getId({ user, room })
    this.user = user
    this.room = room

    this.ws = new ObservableWebSocket(url)

    this.incoming$ = this.ws.incoming$.pipe(
      map((event: MessageEvent) => parseMessageData(event.data))
    )

    this.$subscriptions.add(this.outgoing$.subscribe((msg) => this.send(msg)))
  }

  send(msg: ProgressMessage | CompleteMessage) {
    this.ws.send(msg)
  }

  destroy() {
    this.ws.close()
    this.$subscriptions.forEach((subscription) => { subscription.unsubscribe() })
  }
}