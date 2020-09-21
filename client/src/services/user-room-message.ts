import { Observable, BehaviorSubject, Subject, Subscription } from 'rxjs'
import { map, tap, withLatestFrom } from 'rxjs/operators'
import { CompleteMessage, ProgressMessage } from 'src/message/message'
import { logger } from 'src/logger'

const log = logger('user-room-message')

const makeId = () => `msg-${Date.now()}-${Math.random().toPrecision(7)}`

export class UserRoomMessages{
  // UserRoom pushes values to these
  progressText$: Subject<string> = new Subject()
  completeSignal$: Subject<null> = new Subject()

  // identifies messages (from first PROGRESS message to COMPLETE message)
  id$ = new BehaviorSubject<string>(makeId())

  // outgoing messages
  progressMsg$: Observable<ProgressMessage> = this.progressText$.pipe(
    withLatestFrom(this.id$),
    map(([text, id]) => ({ type: 'PROGRESS', text, time: Date.now(), id } as ProgressMessage)),
  )
  completeMsg$: Observable<CompleteMessage> = this.completeSignal$.pipe(
    withLatestFrom(this.id$),
    map(([_, id]) => ({ type: 'COMPLETE', time: Date.now(), id } as CompleteMessage)),
    tap((msg) => log.info('complete message', { msg }))
  )

  $subscriptions: Set<Subscription> = new Set()

  constructor() {
    // set new message ID when completeMsg is sent
    this.$subscriptions.add(
      this.completeMsg$.pipe(
        map(() => makeId()),
        tap((id) => log.info('made id', { id }))
      ).subscribe(this.id$)
    )
  }

  destroy = () => {
    this.$subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}