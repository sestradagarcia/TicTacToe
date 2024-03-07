import { Lightning } from '@lightningjs/sdk'

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      Logo: {
        x: 960,
        y: 540,
        mount: 0.5,
        text: { text: 'LOADING...', fontFace: 'pixel' },
      },
    }
  }

  set pulseText(v) {
    this._text = v
  }

  _init() {
    this._logo = this.tag('Logo')
    this._logo.text.text = this._text
  }

  //changed from init to active because init only render the first time
  // since i go back to the splash if exit is clicked then rendering only the first time wont suffice
  _active() {
    //debugger
    //_pulse is a property of splash class that is being assigned the animation for the Logo element in template
    this._pulse = this.tag('Logo').animation({
      duration: 4,
      repeat: 0,
      actions: [{ p: 'alpha', v: { 0: 0, 0.5: 0.5, 1: 0 } }],
    })

    //
    this._pulse.on('finish', () => {
      //A Signal tells the parent component that some event happened on this component.
      this.signal('loaded')
    })

    //when the life cycle event hook is rendered the animation will start
    this._pulse.start()
  }
}
