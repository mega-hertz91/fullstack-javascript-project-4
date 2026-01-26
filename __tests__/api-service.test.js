// @ts-check

import { describe, expect, test } from '@jest/globals'
import { AxiosService } from '../src/services/index.js'
import nock from 'nock'
import { StatusCode, TEST_URL, TestHandler, DELAY_RESPONSE } from '../src/constants/index.js'

nock.disableNetConnect()

describe('API Service', () => {
  test('Status 200', async () => {
    nock(TEST_URL)
      .get(TestHandler.HELLO)
      .delay(DELAY_RESPONSE)
      .reply(StatusCode.OK, 'hello')

    const { status } = await AxiosService.requestGet(TEST_URL + TestHandler.HELLO)

    expect(status).toBe(StatusCode.OK)
  })

  test('Status 404', async () => {
    nock(TEST_URL)
      .get(TestHandler.HELLO)
      .delay(DELAY_RESPONSE)
      .reply(StatusCode.NOT_FOUND, 'hello')

    await expect(AxiosService.requestGet(TEST_URL + TestHandler.HELLO)).rejects.toThrow()
  })

  test('Error', async () => {
    nock(TEST_URL)
      .get(TestHandler.HELLO)
      .delay(DELAY_RESPONSE)
      .replyWithError('server error')

    await expect(AxiosService.requestGet(TEST_URL + TestHandler.HELLO)).rejects.toThrow('server error')
  })
})
