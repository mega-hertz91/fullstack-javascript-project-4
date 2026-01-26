// @ts-check

import path from 'node:path'
import os from 'os'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from '@jest/globals'
import { FSService } from '../src/services/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const getFixturePath = filename => path.resolve(__dirname, '../__fixtures__/', filename)
const tmpDIR = os.tmpdir()

describe('FS service tests', () => {
  test('read file', async () => {
    await expect(FSService.read(getFixturePath('urls.txt'))).resolves.toMatch('https://ru.hexlet.io')
  })
  test('read non-exist file', async () => {
    await expect(FSService.read(getFixturePath('ur.txt'))).rejects.toThrow()
  })
  test('save file', async () => {
    const filePath = tmpDIR + '/file.txt'
    await FSService.save(filePath, 'Boom!!!')
    await expect(FSService.read(filePath)).resolves.toBe('Boom!!!')
  })
  test('save file to non exist file', async () => {
    await expect(FSService.save(tmpDIR, 'Boom!!!')).rejects.toThrow()
  })
})
