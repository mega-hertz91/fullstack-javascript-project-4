// @ts-check

import { expect, test } from '@jest/globals'
import { createNameFromUrl } from '../src/utils'

test('Create page name on URL', () => {
    expect(createNameFromUrl('https://test.com')).toBe('test-com.html')
})