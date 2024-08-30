import { render, Canvas, Config } from '@lightningjs/solid';
import { HashRouter, Route } from "@solidjs/router";
import App from './pages/App';
import NotFound from './pages/NotFound';
import './styles.css';

import coreExtensionModuleUrl from './AppCoreExtensions.js?importChunkUrl';
import coreWorkerUrl from './threadx-core-worker.js?importChunkUrl';
import Splash from './pages/Splash';
import MainMenu from './pages/MainMenu';
import Game from './pages/Game';
import About from './pages/About';
import ExitMenu from './pages/ExitMenu';

Config.debug = true;
Config.fontSettings.fontFamily = 'pixel';
Config.fontSettings.color = 0xffffffff;

const driver = 'main';
const RenderOptions = {
  coreExtensionModule: coreExtensionModuleUrl,
  threadXCoreWorkerUrl: driver === 'threadx' ? coreWorkerUrl : undefined,
  numImageWorkers: 2,
  // deviceLogicalPixelRatio: 1
}

render(() =>  (
  <Canvas options={RenderOptions}>
    <HashRouter root={App}>
      <Route path="/" component={() => <Splash text={"LOADING..."} path='/menu'/>} />
      <Route path="/menu" component={MainMenu} />
      <Route path="/twoPlayerGame" component={() => <Game mode={"two-player"}/>}/>
      <Route path="/singlePlayerGame" component={() => <Game mode={"single-player"}/>} />
      <Route path="/about" component={About} />
      <Route path="/exitmenu" component={ExitMenu} />
      <Route path="/save" component={() => <Splash text={"SAVING..."} />} />
      <Route path="/quit" component={() => <Splash text={"QUITING..."} />} />
      <Route path="/*all" component={NotFound} />
    </HashRouter>
  </Canvas>
));
