import { ChangeEvent } from 'react'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
  @description
    integrates with observable-hooks useObservableState().
    Unfortunately, observable-hooks doesn't seem to provide a readymade
    solution like this. [the pluckCurrentTargetValue
    helper](https://github.com/crimx/observable-hooks/blob/master/packages/observable-hooks/src/helpers.ts#L54-L61)
    does not integrate with useObservableState in a way that is obvious to
    me (there are damning Type mismatches that make it sadly unusable).
 */

export const pluckEventTargetValue = () => {
  // "| string" allows you to specify a string initial value to
  // useObservableState, as an alternative to { target: { value: '' } }
  return (evt$: Observable<ChangeEvent<HTMLInputElement> | string>) => (
    evt$.pipe(
      map((evtOrStr) => typeof evtOrStr === 'string' ?
        evtOrStr :
        (evtOrStr.target as HTMLInputElement).value // (A | B) & !B -> A
      ))
  )
}