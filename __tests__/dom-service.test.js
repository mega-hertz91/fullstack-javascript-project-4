// @ts-check

import { describe, expect, test } from '@jest/globals'
import { DomService, FSService } from '../src/services/index.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const getFixturePath = filename => path.resolve(__dirname, '../__fixtures__/', filename)

describe('Dom Service', () => {
  test('Load dom and search elements', async () => {
    const htmlString = await FSService.read(getFixturePath('index.html'))
    const DOM = DomService.load(htmlString)
    expect(DOM('title').text()).toBe('Курсы по программированию Хекслет')
  })
})
