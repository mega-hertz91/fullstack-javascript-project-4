// @ts-check

import { describe, expect, test } from '@jest/globals'
import { pageLoaderAction } from '../src/actions/index.js'

describe('pageLoader', () => {
  test('Invalid url', async () => {
    await expect(pageLoaderAction('https:/test.com/', '/sys')).rejects.toThrow()
  })
})
