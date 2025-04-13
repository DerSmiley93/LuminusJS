import game from './engine/core/game.js';
import testScene from './testScene.js';


const viewportHeight = document.body.clientHeight;
const viewportWidth = document.body.clientWidth;
game.createCanvas(viewportWidth,viewportHeight);

game.enableProfiler = true;

game.ctx.imageSmoothingEnabled = false;
game.loadScene(testScene,true);
