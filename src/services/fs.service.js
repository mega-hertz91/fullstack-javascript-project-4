import fs from 'fs/promises';

const ENCODING = 'utf-8';

export class FSService {
    /**
     * Create file
     * @param {String} path
     * @param {String, Buffer} data
     * @return {Promise<>}
     */
    static save(path, data) {
        return fs.writeFile(path, data)
    }

    /**
     * @param path
     * @param {String} encoding
     * @returns {Promise<>}
     */
    static read(path, encoding = ENCODING) {
        return fs.readFile(path, {encoding})
    }
}