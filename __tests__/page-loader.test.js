// @ts-check

import { describe, expect, test } from '@jest/globals'
import { pageLoaderAction } from '../src/actions/index.js'
import nock from 'nock'
import { StatusCode } from '../src/constants/index.js'
import { FSService } from '../src/services/index.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'os'
import fs from 'fs/promises'

const tmpDir = os.tmpdir()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const getFixturePath = filename => path.resolve(__dirname, '../__fixtures__/', filename)

describe('pageLoader', () => {
  test('Invalid url', async () => {
    await expect(pageLoaderAction('https:/test')).rejects.toThrow()
  })

  test('Not exist path', async () => {
    const html = await FSService.read(getFixturePath('response.html'))

    nock('http://localhost:3001')
      .get('/courses')
      .reply(StatusCode.OK, html, {
        contentType: 'text/html',
      })

    await expect(pageLoaderAction('http://localhost:3001/courses', '/sys')).rejects.toThrow()
  })

  test('Page loader test', async () => {
    const html = await FSService.read(getFixturePath('response.html'))
    const css = await FSService.read(getFixturePath('application.css'))
    const png = await FSService.read(getFixturePath('nodejs.png'))

    nock('http://localhost:3001')
      .get('/courses')
      .delay(300)
      .reply(StatusCode.OK, html, {
        contentType: 'text/html',
      })
      .get('/assets/application.css')
      .delay(300)
      .reply(StatusCode.OK, css, {
        contentType: 'text/css',
      })
      .get('/assets/professions/nodejs.png')
      .delay(300)
      .reply(StatusCode.OK, png, {
        contentType: 'image/png',
      })

    await expect(pageLoaderAction('http://localhost:3001/courses', tmpDir)).resolves.toBe('Page was successfully downloaded')
    await expect(FSService.access(path.join(tmpDir, 'localhost-courses_files', 'localhost-courses-assets-application.css'), fs.constants.F_OK)).resolves.toBeUndefined()
    await expect(FSService.access(path.join(tmpDir, 'localhost-courses_files', 'localhost-courses-assets-professions-nodejs.png'), fs.constants.F_OK)).resolves.toBeUndefined()
  })
})
