import { Server } from 'mock-socket'
import { ObservableWebSocket } from '../observable-websocket'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// tests do not work right now because library mock-socket does not implement
// EventEmitter properly...
xdescribe('ObservableWebSocket', () => {
  it('outputs incoming$ on messages', async () => {
    expect.assertions(1)

    const msg = `msg-${Date.now()}-${Math.random()}`

    const mockServer = new Server('ws://localhost:8000')
    mockServer.on('connection', async (socket) => {
      await wait(100)
      socket.send(msg)
    })

    const observableWebSocket = new ObservableWebSocket('ws://localhost:8000')
    observableWebSocket.incoming$.subscribe((inMsg) => {
      expect(inMsg).toEqual(msg)
    })

    mockServer.stop()
  })
})
