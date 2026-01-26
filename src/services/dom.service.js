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
          value: (el) => {
            const path = this._dom(el).attr('src')
            const tagName = this._dom(el).prop('tagName')
            return { tagName, path }
          },
        },
      ],
      scripts: [
        {
          selector: 'script',
          value: (el) => {
            const path = this._dom(el).attr('src')
            const tagName = this._dom(el).prop('tagName')
            return { tagName, path }
          },
        },
      ],
      links: [
        {
          selector: 'link',
          value: (el) => {
            const path = this._dom(el).attr('href')
            const tagName = this._dom(el).prop('tagName')
            return { tagName, path }
          },
        },
      ],
    })

    return Promise.resolve([...images, ...scripts, ...links])
  }

  getHtmlString() {
    return this._dom.html()
  }

  replaceAttributeSelector(selector, attributeName, attributeValue) {
    this._dom(selector).attr(attributeName, attributeValue)
  }
}
