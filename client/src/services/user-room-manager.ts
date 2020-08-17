import { BehaviorSubject } from 'rxjs'
import { UserRoomService, UserRoom, getId, fromId } from './user-room'

export class UserRoomManager {
  userRoomById: Map<string, UserRoomService> = new Map()
  rooms$: BehaviorSubject<UserRoom[]> = new BehaviorSubject<UserRoom[]>([])

  addRoom(userRoom: UserRoom): UserRoomService {
    let service: UserRoomService | null = this.getRoom(userRoom)
    if (service) {
      return service
    }

    service = new UserRoomService(userRoom)
    const id = getId(userRoom)
    this.userRoomById.set(id, service)
    this.rooms$.next(Array.from(this.userRoomById.keys()).map(fromId))

    return service
  }

  getRoom(userRoom: UserRoom): UserRoomService | null {
    const id = getId(userRoom)
    return this.userRoomById.get(id) || null
  }

  removeRoom(userRoom: UserRoom): UserRoomService | null {
    const id = getId(userRoom)
    const service = this.userRoomById.get(id) || null
    if (service) {
      this.userRoomById.delete(id)
      service.destroy()
      this.rooms$.next(Array.from(this.userRoomById.keys()).map(fromId))
    }

    return service
  }
}