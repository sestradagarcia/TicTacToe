import { WebGlCoreRenderer, SdfTextRenderer } from "@lightningjs/renderer/webgl";
import { Inspector } from "@lightningjs/renderer/inspector";
import { Config, createRenderer, loadFonts, View } from '@lightningtv/solid';
import { HashRouter, Route } from "@solidjs/router";
import App from './pages/App';
import NotFound from './pages/NotFound';

import Splash from './pages/Splash';
import MainMenu from './pages/MainMenu';
import SubMenu from './pages/SubMenu';
import Game from './pages/Game';
import About from './pages/About';
import ExitMenu from './pages/ExitMenu';
import fonts from "./fonts";

const logFps = true;
Config.debug = false;
Config.animationsEnabled = true;
Config.fontSettings.fontFamily = 'Sky';
Config.fontSettings.color = 0xffffffff;
Config.fontSettings.fontSize = 100;
Config.rendererOptions = {
  fpsUpdateInterval: logFps ? 1000 : 0,
  fontEngines: [SdfTextRenderer],
  renderEngine: WebGlCoreRenderer,
  inspector: Inspector,
  deviceLogicalPixelRatio: 1,
  devicePhysicalPixelRatio: 1,
};

const { render } = createRenderer();
loadFonts(fonts);

render(() => (
  <View>
    <HashRouter root={App}>
      <Route path="/" component={() => <Splash text={"LOADING..."} path='/menu' />} />
      <Route path="/menu" component={MainMenu} />
      <Route path="/submenu" component={() => <SubMenu/>} />
      <Route path="/twoplayergame" component={() => <Game mode={"two-player"} />} />
      <Route path="/singleplayergame" component={() => <Game mode={"single-player"} />} />
      <Route path="/about" component={About} />
      <Route path="/exitmenu" component={ExitMenu} />
      <Route path="/save" component={() => <Splash text={"SAVING..."} />} />
      <Route path="/quit" component={() => <Splash text={"QUITING..."} />} />
      <Route path="/*all" component={NotFound} />
    </HashRouter>
  </View>
));
