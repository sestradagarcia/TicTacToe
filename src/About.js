import { Lightning } from '@lightningjs/sdk'

export default class About extends Lightning.Component {
  static _template() {
    return {
      Text: {
        x: 960,
        y: 440,
        mount: 0.5,
        text: {
          text: 'This is a tic-tac-toe game made by Stephanie using LightningJS',
          fontFace: 'Roboto-Regular',
        },
      },
      BackText: {
        x: 960,
        y: 520,
        mount: 0.5,
        scale: 0.6,
        text: { text: 'Press Enter to go back to menu', fontFace: 'pixel' },
      },

      GameAnimation: {
        alpha: 0,
        x: 960,
        y: 580,
        w: 300,
        h: 300,
        mountX: 0.5,
        color: 0xffffffff,
        children: [
          //grid lines
          { rect: true, w: 5, h: 300, y: 0, x: 100 },
          { rect: true, w: 5, h: 300, y: 0, x: 200 },
          { rect: true, w: 300, h: 5, y: 100, x: 0 },
          { rect: true, w: 300, h: 5, y: 200, x: 0 },

          { tag: 'x1', text: 'x', scale: 1.5, x: 235, y: 30, alpha: 0 }, // top right
          { tag: 'x2', text: 'x', scale: 1.5, x: 30, y: 230, alpha: 0 }, // bottom left
          { tag: 'x3', text: 'x', scale: 1.5, x: 30, y: 30, alpha: 0 }, // top left
          { tag: 'x4', text: 'x', scale: 1.5, x: 30, y: 130, alpha: 0 }, // middle left
          { tag: 'o1', text: 'o', scale: 1.5, x: 235, y: 230, alpha: 0 }, // bottom right
          { tag: 'o2', text: 'o', scale: 1.5, x: 135, y: 130, alpha: 0 }, // middle
          { tag: 'o3', text: 'o', scale: 1.5, x: 135, y: 30, alpha: 0 }, // top middle
          { tag: 'winLine', x: 37, y: 20, w: 5, h: 0, rect: true, color: 0xffffffff },
        ],
      },
    }
  }

  _setup() {
    this._showOrder = ['x1', 'o1', 'x2', 'o2', 'x3', 'o3', 'x4']
  }

  _active() {
    this.tag('GameAnimation')
      .animation({
        duration: 2,
        repeat: 0,
        actions: [{ p: 'alpha', v: { 0: 0, 0.5: 0.5, 1: 1 } }],
      })
      .start()

    for (let i = 0; i < 7; i++) {
      this.tag(this._showOrder[i])
        .animation({
          duration: 3 + i * 2,
          repeat: 0,
          actions: [{ p: 'alpha', v: { 0: 0, 0.5: 0, 1: 1 } }],
        })
        .start()
    }

    this.tag('winLine')
      .animation({
        duration: 2 + 2 * this._showOrder.length,
        repeat: 0,
        actions: [{ p: 'h', v: { 0: 0, 0.7: 0, 1: 270 } }],
      })
      .start()
  }

  //handling going back eith signals, in app.js game state there is an example handling going within app.js
  _handleEnter() {
    this.signal('backFromAbout')
  }

  _handleBack() {
    this.signal('backFromAbout')
  }
}
