import { map } from 'rxjs/operators'
import { ObservableWebSocket } from '../util/observable-websocket'
import { parseMessageData } from '../messages/messages'
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

  constructor({ user, room }: UserRoom) {
    const url = `${config.wsUrl}/${room}/?nickname=${user}`

    this.id = getId({ user, room })
    this.user = user
    this.room = room

    this.ws = new ObservableWebSocket(url)

    this.ws.incoming$.pipe(
      map((event: MessageEvent) => parseMessageData(event.data))
    )
  }

  destroy() {
    this.ws.close()
  }
}