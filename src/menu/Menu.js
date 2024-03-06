import { Lightning } from '@lightningjs/sdk'
import Item from './Item.js'

export default class Menu extends Lightning.Component {
  static _template() {
    return {
      Items: {
        x: 40,
      },
      FocusIndicator: { y: 5, text: { text: '>', fontFace: 'pixel' } },
    }
  }

  //lifecycle event hook
  _init() {
    // create blinking animation on focus indicator
    this._blink = this.tag('FocusIndicator').animation({
      duration: 0.5,
      repeat: -1,
      actions: [{ p: 'x', v: { 0: 0, 0.5: -40, 1: 0 } }],
    })

    // start the blinking animation
    this._blink.start()

    // current focused menu index on initialization
    this._index = 0
  }

  // for use in main, setters are called in template just using the setters name and passing props
  set items(item) {
    // create children by handing over an array of
    // object to the objectList
    //referencing the Items element in the template
    this.tag('Items').children = item.map((i, key) => {
      //referencing the imported item component
      // action and label are set using the setter in the item class, y is a lightning posiiton prop
      return { type: Item, action: i.action, label: i.label, y: key * 90 }
    })
  }

  get items() {
    return this.tag('Items').children
  }

  // this getter will be used by main to get the current active index
  get activeItem() {
    return this.items[this._index]
  }

  _setIndex(idx) {
    // since it's a one time transition we use smooth
    this.tag('FocusIndicator').setSmooth('y', idx * 90 + 5)

    // store new index
    this._index = idx
  }

  // on pressing the down button or up, the index will be given a new value
  // so that the index can never go over the length of the items list.
  _handleUp() {
    this._setIndex(Math.max(0, --this._index))
  }

  _handleDown() {
    this._setIndex(Math.min(++this._index, this.items.length - 1))
  }
}
