import { TestScheduler } from 'rxjs/testing'
import { bufferWhen } from '../bufferWhen'

const makeTestScheduler = () => new TestScheduler((actual, expected) => {
  console.log('actual', actual)
  console.log('expected', expected)
  expect(actual).toEqual(expected)
})

fdescribe('bufferWhen', () => {
  it('buffers values until shouldBuffer -> true', () => {
    const testScheduler = makeTestScheduler()
    testScheduler.run(helpers => {
      const { cold, hot, expectObservable } = helpers
      const msg$ = cold('        -ab----cd-|')
      const shouldBuffer$ = hot('--f-------|', { t: true, f: false })
      const expected$ = '        --(ab)-cd-|'

      const values = { a: 'a', b: 'b', c: 'c', d: 'd', }

      const outgoing$ = msg$.pipe(bufferWhen(shouldBuffer$))

      expectObservable(outgoing$).toBe(expected$, values)
    })
  })

  it('uses latest value of shouldBuffer', () => {
    const testScheduler = makeTestScheduler()
    testScheduler.run(helpers => {
      const { cold, hot, expectObservable } = helpers
      const msg$ = cold('        --abc------d-|')
      const shouldBuffer$ = hot('ft---f-------|', { t: true, f: false })
      const expected$ = '        -----(abc)-d-|'

      const values = { a: 'a', b: 'b', c: 'c', d: 'd', }

      const outgoing$ = msg$.pipe(bufferWhen(shouldBuffer$))

      expectObservable(outgoing$).toBe(expected$, values)
    })
  })

  it('buffers when true after having already passed values', () => {
    const testScheduler = makeTestScheduler()
    testScheduler.run(helpers => {
      const { cold, hot, expectObservable } = helpers
      const msg$ = cold('        ab-cd----e---|')
      const shouldBuffer$ = hot('--t--f-------|', { t: true, f: false })
      const expected$ = '        ab---(cd)e---|'

      const values = { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e' }

      const outgoing$ = msg$.pipe(bufferWhen(shouldBuffer$, false))

      expectObservable(outgoing$).toBe(expected$, values)
    })
  })
})