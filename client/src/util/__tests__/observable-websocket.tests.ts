import { Server } from 'mock-socket'
import { ObservableWebSocket } from '../observable-websocket'

describe('ObservableWebSocket', () => {
  it('outputs incoming$ on messages', () => {
    const mockServer = new Server('ws://localhost:8000')
    const observableWebSocket = new ObservableWebSocket('ws://localhost:8000')

    const msg = `msg-${Date.now()}-${Math.random()}`

    observableWebSocket.incoming$.subscribe((inMsg) => {
      expect(inMsg).toEqual(msg)
    })

    mockServer.on('connection', (socket) => {
      socket.send(msg)
    })
  })
})