import * as cheerio from 'cheerio'

export default class DomService {
  static load(string) {
    return cheerio.load(string)
  }
}
