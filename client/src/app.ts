import { UserRoomManager } from 'src/services/user-room-manager'
import { AuthRouter } from 'src/controllers/auth-router'


import 'src/services/chat-server-socket'
export interface App {
  userRoomManager: UserRoomManager,
  authRouter: AuthRouter,
}

export function init(): App {
  const userRoomManager = new UserRoomManager()
  const authRouter = new AuthRouter()

  const app = {
    userRoomManager,
    authRouter,
  }

  return app
}

export const app = init()