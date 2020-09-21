import { BehaviorSubject } from 'rxjs'
import { UserRoomService, UserRoom, getId } from 'src/services/user-room'

export class UserRoomManager {
  userRoomById: Map<string, UserRoomService> = new Map()
  rooms$: BehaviorSubject<UserRoomService[]> = new BehaviorSubject<UserRoomService[]>([])

  addRoom(userRoom: UserRoom): UserRoomService {
    const id = getId(userRoom)
    let service = this.getRoom(id)
    if (service) {
      return service
    }

    service = new UserRoomService(userRoom)
    this.userRoomById.set(service.id, service)
    this._publishUserRooms()

    return service
  }

  getRoom(userRoomId: string): UserRoomService | null {
    return this.userRoomById.get(userRoomId) || null
  }

  removeRoom(userRoomId: string): UserRoomService | null {
    const service = this.getRoom(userRoomId)

    if (service) {
      this.userRoomById.delete(userRoomId)
      service.destroy()
      this._publishUserRooms()
    }

    return service
  }

  _publishUserRooms = () => {
    this.rooms$.next(Array.from(this.userRoomById.values()))
  }
}