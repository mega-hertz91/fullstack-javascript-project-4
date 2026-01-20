// @ts-check

import { expect, test, describe } from '@jest/globals'
import { createNameFromUrl } from '../src/utils'

describe('Crate name from URL', () => {
  test('Valid url', () => {
    expect(createNameFromUrl('https://test.com')).toBe('test-com')
  })
  test('Invalid url', () => {
    expect(createNameFromUrl('://test.com')).toBeNull()
  })
})
