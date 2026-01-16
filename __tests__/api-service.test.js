// @ts-check

import {describe, expect, test} from '@jest/globals'
import {AxiosService} from "../src/services/index.js";
import nock from 'nock';
import {STATUS_CODE} from "../src/constants/index.js";

nock.disableNetConnect();

describe('API Service', () => {
    test('Status 200', async () => {
        nock('http://localhost:3001').get('/hello').reply(STATUS_CODE.OK, 'hello');

        const { status } = await AxiosService.requestGet('http://localhost:3001/hello')

        expect(status).toBe(STATUS_CODE.OK)
    })
    test('Status 404', async () => {
        nock('http://localhost:3001').get('/hello').reply(STATUS_CODE.NOT_FOUND, 'hello');

        const { status } = await AxiosService.requestGet('http://localhost:3001/hello')

        expect(status).toBe(STATUS_CODE.NOT_FOUND)
    })
    test('Error', async () => {
        nock('http://localhost:3001').get('/hello').replyWithError('server error');

        await expect(AxiosService.requestGet('http://localhost:3001/hello')).resolves.toThrow('server error');
    })
})