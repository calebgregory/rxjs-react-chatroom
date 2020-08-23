import { Observable, concat, of } from 'rxjs'

/*
 * bufferWhen buffers whenever the shouldBufferObservable pushes a value of
 * `true`; when it pushes `false`, it flushes the buffer, pushing values
 * incoming on srcObservable one at a time, then pushing valuces incoming on
 * srcObservable as they come in.  see test marble diagrams for examples.
 *
 * optional second param initialBool specifies whether or not to buffer at the
 * start of the observable.
 * by default, starts buffering until shouldBufferObservable pushes `false`
 */
export function bufferWhen(shouldBufferObservable: Observable<boolean>, initialBool: boolean = true) {
  const shouldBuffer$ = concat(of(initialBool), shouldBufferObservable)
  return (observable: Observable<any>) => new Observable(observer => {
    // this function will called each time this
    // Observable is subscribed to.
    let buffer: any[] = []
    let shouldBuffer = initialBool

    const switchSubscription = shouldBuffer$.subscribe({
      next(_shouldBuffer: boolean) {
        if (_shouldBuffer === false && buffer.length > 0) {
          buffer.forEach((val) => observer.next(val))
          buffer = []
        }
        shouldBuffer = _shouldBuffer
      },
      error(err) {
        observer.error(err)
      },
      complete() {
        observer.complete()
      }
    })

    const valueSubscription = observable.subscribe({
      next(value: any) {
        if (shouldBuffer) {
          buffer.push(value)
        } else {
          observer.next(value)
        }
      },
      error(err) {
        observer.error(err)
      },
      complete() {
        observer.complete()
      }
    })

    // the return value is the teardown function,
    // which will be invoked when the new
    // Observable is unsubscribed from.
    return () => {
      valueSubscription.unsubscribe()
      switchSubscription.unsubscribe()
      buffer = []
    }
  })
}

// original implementation that was complex:
//    const subscription = combineLatest(observable, shouldBuffer$).subscribe({
//      next([ value, bool ]) {
//        const boolChanged = lastBool !== bool
//        if (boolChanged && !bool && buffer.length > 0) { // flush buffer
//          log('flushing buffer | boolChanged && !bool && buffer.length > 0', { boolChanged, bool, buffer, value })
//          buffer.forEach((val) => observer.next(val))
//          buffer = []
//        } else if (!boolChanged && bool) { // cache value
//          log('pushing value   | !boolChanged && bool                     ', { boolChanged, bool, buffer, value })
//          buffer.push(value)
//        } else { // pass through value
//          log('->              | else .                                   ', { boolChanged, bool, buffer, value })
//          observer.next(value)
//        }
//        lastBool = bool
//      },
//      error(err) {
//        observer.error(err)
//      },
//      complete() {
//        observer.complete()
//      }
//    })