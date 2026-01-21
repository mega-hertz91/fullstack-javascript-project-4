import * as cheerio from 'cheerio'

export default class DomService {
  constructor(string) {
    this._dom = cheerio.load(string)
  }

  querySelectorAll(selector) {
    return Promise.resolve(this._dom(selector))
  }

  extractResources() {
    return Promise.resolve(this._dom.extract({
      images: [
        {
          selector: 'img',
          value: 'src',
        },
      ],
      // links: [
      //   {
      //     selector: 'a',
      //     value: 'href',
      //   },
      // ],
    }))
  }

  getHtmlString() {
    return this._dom.html()
  }
}
