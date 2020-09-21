import { UserRoomManager } from 'src/services/user-room-manager'

export interface App {
  userRoomManager: UserRoomManager,
}

export function init(): App {
  const userRoomManager = new UserRoomManager()

  const app = {
    userRoomManager
  }

  return app
}

export const app = init()