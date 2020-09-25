import * as t from '../test'

fdescribe('powerset', () => {
  test.each([
    [new Set([1, 2]), new Set([new Set([1, 2]), new Set([1]), new Set([2]), new Set()])],
    [new Set([1, 2, 3]), new Set([
      new Set([1, 2, 3]),
      new Set([1, 2]),
      new Set([1, 3]),
      new Set([2, 3]),
      new Set([1]),
      new Set([2]),
      new Set([3]),
      new Set()
    ])],
  ])('%p', (arg, result) => {
    expect(t.powerset(arg)).toEqual(result)
  })
})