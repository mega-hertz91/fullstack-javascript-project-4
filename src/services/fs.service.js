import fs from 'fs/promises'

const ENCODING = 'utf-8'

export default class FSService {
  /**
   * Create file
   * @param {String} path
   * @param {String, Buffer} data
   * @param {Object} options
   * @return {Promise<>}
   */
  static save(path, data, options = {}) {
    return fs.writeFile(path, data, options)
  }

  /**
     * @param path
     * @param {String} encoding
     * @returns {Promise<>}
     */
  static read(path, encoding = ENCODING) {
    return fs.readFile(path, { encoding })
  }

  static mkdir(path, options = {}) {
    return fs.mkdir(path, options)
  }

  static rmdir(path) {
    return fs.rmdir(path)
  }

  static access(path, options = {}) {
    return fs.access(path, options)
  }
}
