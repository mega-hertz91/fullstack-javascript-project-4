// @ts-check

import { describe, expect, test } from '@jest/globals'
import { AxiosService } from '../src/services/index.js'
import nock from 'nock'
import { StatusCode } from '../src/constants/index.js'

nock.disableNetConnect()

describe('API Service', () => {
  test('Status 200', async () => {
    nock('http://localhost:3001').get('/hello').reply(StatusCode.OK, 'hello')

    const { status } = await AxiosService.requestGet('http://localhost:3001/hello')

    expect(status).toBe(StatusCode.OK)
  })
  test('Status 404', async () => {
    nock('http://localhost:3001').get('/hello').reply(StatusCode.NOT_FOUND, 'hello')

    await expect(AxiosService.requestGet('http://localhost:3001/hello')).rejects.toThrow()
  })
  test('Error', async () => {
    nock('http://localhost:3001').get('/hello').replyWithError('server error')

    await expect(AxiosService.requestGet('http://localhost:3001/hello')).rejects.toThrow('server error')
  })
})
