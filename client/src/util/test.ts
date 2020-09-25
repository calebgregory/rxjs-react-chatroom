import * as R from 'ramda'
import { TestScheduler } from 'rxjs/testing'

export function makeTestScheduler() {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected)
  })
  return testScheduler
}

/*
{1,2,3}

{1,2,3} 1 {2,3} 2 {3} 3 {}
{1,2,}  1 {2}
{1,3,}  1 {3}
{2,3,}
{1,}
{2,}
{3,}
{}
*/

export function powerset(S: Set<any>): Set<Set<any>> {
  let i = 0
  const _ps = (list: Array<any>): Array<Array<any>> => {
    if (list.length === 0) {
      return [[]] // base case 'empty set'
    }

    const [ head, ...tail ] = list // pick first
    const tailPS = _ps(tail)       // recur rest
    const subsets = [              // combine
      ...tailPS,                   //             the other subsets
      ...tailPS.map((subset) => [head, ...subset]) // with each of those subsets' elements, combined with the one we picked
    ] // ,-o-o if you've picked one out of a set, it will not be in the the remaining set's subsets

    return subsets
  }
  const subsets: Array<Array<any>> = _ps(Array.from(S))
  return new Set(subsets.map((subset) => new Set(subset)))
}