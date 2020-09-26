import { powerset } from 'src/util/test'
import * as c from '../Register'

describe('validQualitiesFromPassword', () => {
  it('says when password has lowercase letter', () => {
    const validQualities = c.validQualitiesFromPassword('a')
    expect(validQualities).toEqual(new Set([c.HAS_LOWER]))
  })

  it('says when password has uppercase letter', () => {
    const validQualities = c.validQualitiesFromPassword('A')
    expect(validQualities).toEqual(new Set([c.HAS_UPPER]))
  })

  it('says when password has digit', () => {
    const validQualities = c.validQualitiesFromPassword('1')
    expect(validQualities).toEqual(new Set([c.HAS_DIGIT]))
  })


  it('says when password is long enough', () => {
    const validQualities = c.validQualitiesFromPassword('asdfas09fja0sdfasdf')
    expect(validQualities.has(c.IS_ENOUGH)).toEqual(true)
  })
})

describe('getQualitiesStyle', () => {
  it('has color = green when hasQuality = true', () => {
    const styles = c.getQualitiesStyle(true)
    expect(styles).toMatchSnapshot()
  })
})

describe('getIsFormValid', () => {
  const allQualities = new Set([c.HAS_DIGIT, c.HAS_LOWER, c.HAS_UPPER, c.IS_ENOUGH])
  const qualitiesPowerset: Set<Set<string>> = powerset(allQualities)
  const strictSubset = Array.from(qualitiesPowerset).filter((subset) => subset === allQualities) // is actually strict subset now...

  test.each([
    [allQualities, 'a', 'a', true],
    [allQualities, 'aa', 'a', false],
    ...strictSubset.map((subset: Set<string>) => [subset, 'a', 'a', false])
  ])('%p %s %s -> %p', (validQualities, password, confirmPassword, expected) => {
    const isValid = c.getIsFormValid(validQualities as Set<string>, password as string, confirmPassword as string)
    expect(isValid).toEqual(expected)
  })
})