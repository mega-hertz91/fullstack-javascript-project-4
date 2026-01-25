// @ts-check

import { describe, expect, test } from '@jest/globals'
import { pageLoaderAction } from '../src/actions/index.js'

describe('pageLoader', () => {
  test('Invalid url', () => {
    expect(pageLoaderAction('https:/test.com/')).rejects.toThrow()
  })
})
