import { interval, Observable } from 'rxjs'
import { filter, map, tap, take } from 'rxjs/operators'
import { bufferWhen } from '../src/observables/operators/bufferWhen'

const src$: Observable<number> = interval(200).pipe(take(60))
const switch$: Observable<boolean> = interval(1)
  .pipe(
    filter((x) => x % 1500 === 0),
    map((x) => (x / 100) % 2 === 0),
    tap((x) => { console.log('switch:', x) }),
    take(6)
  )

// switch$.subscribe((val) => { console.log('->', val ) })
const subscription = src$.pipe(bufferWhen(switch$))
  .subscribe({
    next: (val) => { console.log('->', val) },
    error: (err) => { console.log('-#', err) },
    complete: () => { console.log('-|')}
  })