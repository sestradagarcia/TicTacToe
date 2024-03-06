import { Lightning, Utils } from '@lightningjs/sdk'
import Splash from './Splash.js'
import Main from './Main.js'
import Game from './Game.js'
import About from './About.js'
import Exit from './Exit.js'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'pixel', url: Utils.asset('fonts/pixel.ttf'), descriptor: {} }]
  }

  static _template() {
    // static a method that belongs to a class rather than an instance of a class
    return {
      Background: {
        rect: true,
        color: 0xff404be3, // blue background colour (ARGB colour)
        w: 1920, // Width of the background (adjust as needed)
        h: 1080, // Height of the background (adjust as needed) to draw a blue rectangle of 1920px by 1080px
      },
      Logo: {
        x: 100,
        y: 100,
        text: { text: 'TicTacToe', fontFace: 'pixel' }, // A text texture, and text and fontface is a prop of the text texture
      },
      // Texture type
      rect: true,
      color: 0xff000000,
      Splash: {
        type: Splash,
        signals: { loaded: true },
        alpha: 0,
        //pulseText: 'Loading...',
      },
      //component which will be shown at the moment the Splash component sends the loaded signal
      Main: {
        type: Main,
        alpha: 0,
        // calls the menuSelect method to decide whether the item has the signal or not
        signals: { select: 'menuSelect' },
      },
      Game: {
        type: Game,
        alpha: 0,
      },
      About: {
        type: About,
        signals: { backFromAbout: true },
        alpha: 0,
      },
      Exit: {
        type: Exit,
        alpha: 0,
        signals: { quit: true },
        //signals: { select: 'exitSelect' },
      },
    }
  }

  // lifecycle event hook
  // on set up, the spalsh state will be entered
  _setup() {
    //this.tag('Splash').pulseText = 'Loading...';
    this._setState('Splash')
  }
  // statemachine
  static _states() {
    return [
      // the state will either be splash, main or game
      class Splash extends this {
        $enter() {
          this.tag('Splash').setSmooth('alpha', 1)
        }

        $exit() {
          this.tag('Splash').setSmooth('alpha', 0)
        }
        //this method will be called during splash state, throughout, not just on entering the state
        //it will be called when the the pulse animation finishes and loaded signal is fired as defined in the splash class
        loaded() {
          this._setState('Main')
        }
      },
      class Main extends this {
        $enter() {
          this.tag('Main').patch({
            smooth: { alpha: 1, y: 0 },
          })
        }

        $exit() {
          this.tag('Main').patch({
            smooth: { alpha: 0, y: 100 },
          })
        }

        //this method takes in an object parameter
        menuSelect({ item }) {
          if (this._hasMethod(item.action)) {
            return this[item.action]()
          }
        }

        // on the start signal being fired
        start() {
          this._setState('Game')
        }

        // on the about signal being fired
        about() {
          this._setState('About')
        }
        exit() {
          this._setState('Exit')
        }

        // change focus path to main
        // component which handles the remotecontrol
        _getFocused() {
          return this.tag('Main')
        }
      },
      class Game extends this {
        $enter() {
          // this component should become visible
          this.tag('Game').setSmooth('alpha', 1)
        }
        // this component should become not be visible
        $exit() {
          this.tag('Game').setSmooth('alpha', 0)
        }

        _getFocused() {
          return this.tag('Game')
        }
      },
      class About extends this {
        $enter() {
          this.tag('About').setSmooth('alpha', 1)
        }

        $exit() {
          this.tag('About').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('About')
        }
        backFromAbout() {
          this._setState('Main')
        }
      },
      class Exit extends this {
        $enter() {
          this.tag('Exit').setSmooth('alpha', 1)
        }

        $exit() {
          this.tag('Exit').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('Exit')
        }
        // exitSelect({ item }) {
        //   if (this._hasMethod(item.action)) {
        //     return this[item.action]()
        //   }
        // }
        quit() {
          this._setState('Splash')
        }

        //this.tag('Splash').pulseText = 'Exiting...'
      },
    ]
  }
}
