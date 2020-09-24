import React, { useRef, useEffect } from 'react'
import { Observer } from 'rxjs'
import { map, filter } from 'rxjs/operators'
import { useObservable, useObservableCallback, useObservableState, useSubscription } from 'observable-hooks'
import { pluckEventTargetValue } from 'src/observables/helpers'

interface Props {
  progressText$: Observer<string>,
  send$: Observer<null>,
}

export function Prompt({ progressText$, send$ }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [input, onChange] = useObservableState(pluckEventTargetValue(), '')

  const progress$ = useObservable(
    (input$) => input$.pipe(
      map(([x]) => x),
      filter((x) => x.length > 0)
    ),
    [input]
  )

  const [onSubmit, submit$] = useObservableCallback<React.SyntheticEvent<HTMLFormElement>, React.SyntheticEvent<HTMLFormElement>>(
    (event$) => event$
  )

  // submit events should not refresh the page; cleanup input
  useSubscription(submit$, (event) => { event.preventDefault(); onChange('') })

  // pipe PROGRESS messages to progressText$ Subject
  useEffect(() => {
    const subscription = progress$.subscribe(progressText$)
    return () => { subscription.unsubscribe() }
  }, [progress$, progressText$])

  // pipe submit events to completeSignal$ Subject
  useEffect(() => {
    const subscription = submit$.pipe(map(() => null)).subscribe(send$)
    return () => { subscription.unsubscribe() }
  }, [submit$, send$])

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef])

  return (
    <ul>
      <li>
        <form onSubmit={onSubmit}>
          &gt;
          {' '}
          <input type="text" ref={inputRef} onChange={onChange} value={input} />
          <span style={{fontSize: 10, marginLeft: '5px'}}><i><code>Enter</code> key sends</i></span>
        </form>
      </li>
    </ul>
  )
}
