import { fromEvent, Subject, Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { logger } from '../logger'

const log = logger('services/websocket')

export type MessageType = 'OPEN' | 'MESSAGE' | 'CLOSE' | 'ERROR'

interface JoinedMessage {
  type: 'JOINED',
  user: string,
  // timestamp: string
}
function makeJoinedMessage(user: string): JoinedMessage {
  return { user, type: 'JOINED' }
}

interface LeftMessage {
  type: 'LEFT',
  user: string,
  // timestamp: string
}
function makeLeftMessage(user: string): LeftMessage {
  return { user, type: 'LEFT' }
}

interface JSONMessage {
  type: 'MESSAGE',
  user: string,
  msg: any,
  // maybe we got a message incorrectly formatted as something other than JSON:
  msgFailedParse?: boolean,
}
function makeJSONMessage(user: string, json: string): JSONMessage {
  let msg
  try {
    msg = JSON.parse(json)
  } catch (error) {
    log.warn("makeJSONMessage - error parsing message JSON", { error })
    return { user, msg: json, type: 'MESSAGE', msgFailedParse: true }
  }
  return { user, msg, type: 'MESSAGE' }
}

interface UnknownMessage {
  type: 'UNKNOWN',
  data: string
}
function makeUnknownMessage(data: string): UnknownMessage {
  return { data, type: 'UNKNOWN' }
}

const joinedFormat = /^(.+) joined (.+)$/
const leftFormat = /^(.+) left the room$/
const messageFormat = /^(.+): (.+)$/

function parseMessageData(data: string): JoinedMessage | LeftMessage | JSONMessage | UnknownMessage {
  if (joinedFormat.test(data)) {
    const [ user ] = joinedFormat.exec(data)?.slice(1) || []
    return makeJoinedMessage(user)
  }

  if (leftFormat.test(data)) {
    const [ user ] = leftFormat.exec(data)?.slice(1) || []
    return makeLeftMessage(user)
  }

  if (messageFormat.test(data)) {
    const [ user, json ] = messageFormat.exec(data)?.slice(1) || []
    return makeJSONMessage(user, json)
  }

  return makeUnknownMessage(data)
}

export class ObservableWebSocket {
  ws: WebSocket
  incoming$: Observable<MessageEvent>
  outgoing$: Subject<any> = new Subject()
  incoming$subscription: Subscription

  constructor(url: string) {
    this.ws = new WebSocket(url)
    this.incoming$ = fromEvent<MessageEvent>(this.ws, 'message')

    this.incoming$subscription = this.incoming$.pipe(
      map((event: MessageEvent) => parseMessageData(event.data))
    ).subscribe((msg: any) => {
      log.info('incoming msg', { msg })
    })

    this.outgoing$.pipe(
      map((data: string) => JSON.stringify(data))
    ).subscribe((msg: string) => {
      this.ws.send(msg)
    })

    // @TODO: buffer outgoing messages until connection is open
    this.ws.onopen = (evt: Event) => {
      log.info('ws open', { url, evt })
    }

    this.ws.onclose = (evt: Event) => {
      log.info('ws close', { url, evt })
    }

    this.ws.onerror = (evt: Event) => {
      log.error('ws error', { url, evt })
    }
  }

  destroy() {
    this.outgoing$.complete()
    this.incoming$subscription.unsubscribe()
  }

  close() {
    this.ws.close(1000, 'Done')
    this.destroy()
  }

  send(data: any) {
    this.outgoing$.next(data)
  }
}