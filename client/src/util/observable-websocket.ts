import { fromEvent, Observable, Subject, BehaviorSubject } from 'rxjs'
import { tap, share, map } from 'rxjs/operators'
import { bufferWhen } from '../observables/operators'
import { logger } from '../logger'

const log = logger('services/websocket')

export type MessageType = 'OPEN' | 'MESSAGE' | 'CLOSE' | 'ERROR'
type ConnectionStatus = 'OPEN' | 'CLOSED'

export function createOutgoing$(msg$: Observable<any>, connectionStatus$: Observable<ConnectionStatus>): Observable<any> {
  const status$ = connectionStatus$.pipe(share())
  const shouldBuffer$ = status$.pipe(map(status => status === 'CLOSED'))
  return msg$
    .pipe(
      bufferWhen(shouldBuffer$)
    )
}

export class ObservableWebSocket {
  ws: WebSocket
  incoming$: Observable<MessageEvent>
  outgoing$: Subject<any> = new Subject()
  connectionStatus$: BehaviorSubject<ConnectionStatus> = new BehaviorSubject<ConnectionStatus>('CLOSED')

  constructor(url: string) {
    this.ws = new WebSocket(url)
    this.incoming$ = fromEvent<MessageEvent>(this.ws, 'message')
      .pipe(
        tap((event: any) => { log.info('incoming msg', { event, msg: event.data }) })
      )

    createOutgoing$(this.outgoing$, this.connectionStatus$).subscribe((data: any) => {
      const msg = JSON.stringify(data)
      this.ws.send(msg)
    })

    // @TODO: buffer outgoing messages until connection is open
    this.ws.onopen = (evt: Event) => {
      log.info('ws open', { evt })
      this.connectionStatus$.next('OPEN')
    }

    this.ws.onclose = (evt: Event) => {
      log.info('ws close', { url, evt })
      this.connectionStatus$.next('CLOSED')
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
    this.outgoing$.next(data)
  }
}