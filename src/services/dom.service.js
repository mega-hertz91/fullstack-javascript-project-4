import * as cheerio from 'cheerio'

export default class DomService {
  constructor(string) {
    this._dom = cheerio.load(string)
  }

  querySelectorAll(selector) {
    return Promise.resolve(this._dom(selector))
  }

  extractResources() {
    const { images = [], scripts = [], links = [] } = this._dom.extract({
      images: [
        {
          selector: 'img',
          value: 'src',
        },
      ],
      scripts: [
        {
          selector: 'script',
          value: 'src',
        },
      ],
      links: [
        {
          selector: 'link',
          value: 'href',
        },
      ],
    })

    return Promise.resolve([...images, ...scripts, ...links])
  }

  getHtmlString() {
    return this._dom.html()
  }
}
