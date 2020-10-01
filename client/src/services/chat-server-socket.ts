import { Socket } from 'phoenix'
import { logger } from 'src/logger'

const log = logger('chat-server-socket')

const socket = new Socket("ws://localhost:4000/socket")

socket.connect()

const channel = socket.channel("room:permitted", { user: 'me' })
log.info('in chat-server-socket', { socket, channel })

channel.join()
  .receive("ok", (resp) => { log.info("Joined successfully", { resp }) })
  .receive("error", (resp) => { log.info("Unable to join", { resp }) })

channel.on("new:msg", (payload) => {
  const message = `[${Date()}] ${payload.body}`
  log.info('Received message', { message })
})

channel.push("new:msg", { body: 'test' })

export default socket
