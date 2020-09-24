import React, { useRef, ChangeEvent, useEffect } from 'react'
import { Observable, Observer } from 'rxjs'
import { map, filter } from 'rxjs/operators'
import { useObservable, useObservableCallback, useObservableState, useSubscription } from 'observable-hooks'

interface Props {
  progressText$: Observer<string>,
  send$: Observer<null>,
}

export function Prompt({ progressText$, send$ }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [input, onChange] = useObservableState(
    (evt$: Observable<ChangeEvent<HTMLInputElement> | string>) => (
      evt$.pipe(
        map((evt) => typeof evt === 'string' ?
          evt :
          (evt.target as HTMLInputElement).value)
      )
    ),
    ''
  )

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
    <li>
      <form onSubmit={onSubmit}>
        &gt;
        {' '}
        <input type="text" ref={inputRef} onChange={onChange} value={input} />
        <span style={{fontSize: 10, marginLeft: '5px'}}><i><code>Enter</code> key sends</i></span>
      </form>
    </li>
  )
}
