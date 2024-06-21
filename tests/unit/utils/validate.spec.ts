import { isValidUsername, isExternal } from '@/utils/validate'

describe('Utils:validate', () => {
  it('isValidUsername', () => {
    expect(isValidUsername('developer-admin')).toBe(true)
    expect(isValidUsername('editor')).toBe(true)
    expect(isValidUsername('xxxx')).toBe(false)
    expect(isValidUsername('peopling-admin')).toBe(true)
  })

  it('isExternal', () => {
    //TODO:kaldırılcak
    expect(isExternal('https://www.armour.com/')).toBe(true)
    expect(isExternal('mailto:someone@test.com')).toBe(true)
    expect(isExternal('123aBC')).toBe(false)
  })
})
