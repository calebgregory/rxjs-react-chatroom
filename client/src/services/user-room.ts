import { ObservableWebSocket } from '../util/observable-websocket'
import { config } from '../config'

export interface UserRoom {
  user: string,
  room: string
}

export function getId({ user, room }: UserRoom): string {
  return `${room}.${user}`
}

export function fromId(id: string): UserRoom {
  const [room, user] = id.split('.')
  return { user, room }
}

export class UserRoomService {
  ws: ObservableWebSocket

  constructor({ user, room }: UserRoom) {
    const url = `${config.wsUrl}/${room}/?nickname=${user}`

    this.ws = new ObservableWebSocket(url)
  }

  destroy() {
    this.ws.close()
  }
}