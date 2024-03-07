import { Lightning } from '@lightningjs/sdk'
import Menu from './menu/Menu.js'

export default class ExitMenu extends Lightning.Component {
  static _template() {
    return {
      Question: {
        x: 960,
        y: 300,
        mount: 0.5,
        text: { text: 'Do you want to quit the game?', fontFace: 'pixel', fontSize: 50 },
      },
      Menu: {
        x: 500,
        y: 400,
        type: Menu,
        items: [
          { label: 'QUIT', action: 'quit' },
          { label: 'SAVE', action: 'save' },
        ],
      },
    }
  }

  _getFocused() {
    return this.tag('Menu')
  }

  _handleEnter() {
    // on enter being clicked a signal called select will be fired.
    this.signal('select', { item: this.tag('Menu').activeItem }) //calls the getter method get activeItem()
  }
}
