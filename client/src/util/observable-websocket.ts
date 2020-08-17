import { fromEvent, Subject, Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { logger } from '../logger'

const log = logger('services/websocket')

export type MessageType = 'OPEN' | 'MESSAGE' | 'CLOSE' | 'ERROR'

export class ObservableWebSocket {
  ws: WebSocket
  incoming$: Observable<Event>
  outgoing$: Subject<any> = new Subject()
  incoming$subscription: Subscription

  constructor(url: string) {
    this.ws = new WebSocket(url)
    this.incoming$ = fromEvent(this.ws, 'message')

    this.incoming$subscription = this.incoming$.pipe(
      map((event: Event) => event)
    ).subscribe((msg: any) => {
      console.log('incoming msg', { msg })
    })

    this.outgoing$.pipe(
      map((data: string) => JSON.stringify(data))
    ).subscribe((msg: string) => {
      this.ws.send(msg)
    })

    // @TODO: buffer outgoing messages until connection is open
    this.ws.onopen = (evt: Event) => {
      log.debug('ws open', { url, evt })
    }

    this.ws.onclose = (evt: Event) => {
      log.debug('ws close', { url, evt })
    }

    this.ws.onerror = (evt: Event) => {
      log.debug('ws error', { url, evt })
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