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
    const htmlString = await FSService.read(getFixturePath('response.html'))
    const Dom = new DomService(htmlString)
    const title = await Dom.querySelectorAll('title')
    expect(title.text()).toBe('Курсы по программированию Хекслет')
  })
  test('Extract resources', async () => {
    const htmlString = await FSService.read(getFixturePath('response.html'))
    const Dom = new DomService(htmlString)
    const src = await Dom.extractResources()

    expect(src.length).toBe(5)
  })
})
