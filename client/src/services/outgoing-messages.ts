import { Observable, BehaviorSubject, Subject } from 'rxjs'
import { map, tap, withLatestFrom } from 'rxjs/operators'
import { Service } from 'src/util/service'
import { ProgressMessage, makeProgressMessage, CompleteMessage, makeCompleteMessage } from 'src/message/message'
import { logger } from 'src/logger'

const log = logger('outgoing-message')

const makeId = () => `msg-${Date.now()}-${Math.random().toPrecision(7)}`

export class OutgoingMessages extends Service {
  // UserRoom pushes values to these
  progressText$: Subject<string> = new Subject()
  completeSignal$: Subject<null> = new Subject()

  // identifies messages (from first PROGRESS message to COMPLETE message)
  id$ = new BehaviorSubject<string>(makeId())

  // outgoing messages
  progressMsg$: Observable<ProgressMessage> = this.progressText$.pipe(
    withLatestFrom(this.id$),
    map(([text, id]) => makeProgressMessage(id, text)),
  )
  completeMsg$: Observable<CompleteMessage> = this.completeSignal$.pipe(
    withLatestFrom(this.id$),
    map(([_, id]) => makeCompleteMessage(id)),
    tap((msg) => log.info('complete message', { msg }))
  )

  constructor() {
    super()

    // set new message ID when completeMsg is sent
    this.$(
      this.completeMsg$.pipe(
        map(() => makeId()),
        tap((id) => log.info('made id', { id }))
      ).subscribe(this.id$)
    )
  }
}