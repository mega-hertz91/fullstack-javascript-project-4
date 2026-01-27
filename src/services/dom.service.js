import * as cheerio from 'cheerio'
import { Selector, Attribute } from '../constants/index.js'

const PROP_TAG_NAME = 'tagName'

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
          selector: Selector.IMG,
          value: (el) => {
            const path = this._dom(el).attr(Attribute.SRC)
            const tagName = this._dom(el).prop(PROP_TAG_NAME)
            return { tagName, path, query: `${Selector.IMG}[${Attribute.SRC}='${path}']`, targetAttr: Attribute.SRC }
          },
        },
      ],
      scripts: [
        {
          selector: Selector.SCRIPT,
          value: (el) => {
            const path = this._dom(el).attr(Attribute.SRC)
            const tagName = this._dom(el).prop(PROP_TAG_NAME)

            if (path) {
              return { tagName, path, query: `${Selector.SCRIPT}[${Attribute.SRC}='${path}']`, targetAttr: Attribute.SRC }
            }
          },
        },
      ],
      links: [
        {
          selector: Selector.LINK,
          value: (el) => {
            const path = this._dom(el).attr(Attribute.HREF)
            const tagName = this._dom(el).prop(PROP_TAG_NAME)
            return { tagName, path, query: `${Selector.LINK}[${Attribute.HREF}='${path}']`, targetAttr: Attribute.HREF }
          },
        },
      ],
    })

    return Promise.resolve([...images, ...scripts, ...links])
  }

  getHtmlString() {
    return this._dom.html()
  }

  replaceAttributeSelector(query, attributeName, attributeValue) {
    this._dom(query).attr(attributeName, attributeValue)
  }
}
