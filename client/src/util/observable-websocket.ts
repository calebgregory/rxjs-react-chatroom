import { fromEvent, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { logger } from '../logger'

const log = logger('services/websocket')

export type MessageType = 'OPEN' | 'MESSAGE' | 'CLOSE' | 'ERROR'


export class ObservableWebSocket {
  ws: WebSocket
  incoming$: Observable<MessageEvent>

  constructor(url: string) {
    this.ws = new WebSocket(url)
    this.incoming$ = fromEvent<MessageEvent>(this.ws, 'message')
      .pipe(
        tap((event: any) => { log.info('incoming msg', { event, msg: event.data }) })
      )

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
    // clean up
  }

  close() {
    this.ws.close(1000, 'Done')
    this.destroy()
  }

  send(data: any) {
    const msg = JSON.stringify(data)
    this.ws.send(msg)
  }
}