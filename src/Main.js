import { Lightning } from '@lightningjs/sdk'
import Menu from './menu/Menu.js'

export default class Main extends Lightning.Component {
  static _template() {
    return {
      Menu: {
        x: 600,
        y: 400,
        type: Menu, //this refers to the imported menu component
        items: [
          // calls setter method in menu and sets the menu instance to have this items property
          { label: 'START NEW GAME', action: 'start' }, // calls the setter method set label and set action
          { label: 'ABOUT', action: 'about' },
          { label: 'EXIT', action: 'exit' },
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
