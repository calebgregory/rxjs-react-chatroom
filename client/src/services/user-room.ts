import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ObservableWebSocket } from '../util/observable-websocket'
import { Message } from '../message/message'
import { parseMessageData } from '../message/parsers/oatpp-ws-messages'
import { config } from '../config'

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

  constructor({ user, room }: UserRoom) {
    const url = `${config.wsUrl}/${room}/?nickname=${user}`

    this.id = getId({ user, room })
    this.user = user
    this.room = room

    this.ws = new ObservableWebSocket(url)

    this.incoming$ = this.ws.incoming$.pipe(
      map((event: MessageEvent) => parseMessageData(event.data))
    )
  }

  send(text: string, type: string = 'Full Message') {
    const msg = { time: Date.now(), text, type }
    this.ws.send(msg)
  }

  destroy() {
    this.ws.close()
  }
}