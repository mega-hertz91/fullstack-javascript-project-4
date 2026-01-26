// @ts-check

import { beforeEach, describe, expect, test } from '@jest/globals'
import { pageLoaderAction } from '../src/actions/index.js'
import nock from 'nock'
import { StatusCode, TEST_URL, TestHandler, DELAY_RESPONSE } from '../src/constants/index.js'
import { FSService } from '../src/services/index.js'
import { fileURLToPath } from 'node:url'
import path, { join } from 'node:path'
import os from 'os'
import fs from 'fs'

const tmpDir = os.tmpdir()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const getFixturePath = filename => path.resolve(__dirname, '../__fixtures__/', filename)

describe('pageLoader', () => {
  // afterAll(() => {
  //   fs.unlinkSync(join(tmpDir, 'localhost-courses_files'))
  // })

  beforeEach(async () => {
    const html = await FSService.read(getFixturePath('response.html'))

    nock(TEST_URL)
      .get(TestHandler.COURSES)
      .delay(DELAY_RESPONSE)
      .reply(StatusCode.OK, html, {
        contentType: 'text/html',
      })
      .get('/assets/application.css')
      .delay(DELAY_RESPONSE)
      .reply(StatusCode.OK, () => fs.createReadStream(getFixturePath('application.css')), {
        contentType: 'text/css',
      })
      .get('/assets/professions/nodejs.png')
      .delay(DELAY_RESPONSE)
      .reply(StatusCode.OK, () => fs.createReadStream(getFixturePath('nodejs.png')), {
        contentType: 'image/png',
      })
      .get('/packs/js/runtime.js')
      .delay(DELAY_RESPONSE)
      .reply(StatusCode.OK, () => fs.createReadStream(getFixturePath('runtime.js')), {
        contentType: 'text/javascript',
      })
  })

  test('Invalid url', async () => {
    await expect(pageLoaderAction('https://test')).rejects.toThrow()
  })

  test('Not exist path', async () => {
    await expect(pageLoaderAction(TEST_URL + TestHandler.COURSES, '/sys')).rejects.toThrow()
  })

  test('Page loader test', async () => {
    await expect(pageLoaderAction(TEST_URL + TestHandler.COURSES, tmpDir)).resolves.toBe('Page was successfully downloaded')
  })

  test('Exist HTML file', async () => {
    await expect(await FSService.read(join(tmpDir, 'localhost-test-courses.html'))).toBeDefined()
  })
})
