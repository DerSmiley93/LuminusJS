import game from './engine/core/game.js';
import { CollisionTestScene } from './scenes/collision-test-scene.js';



const viewportHeight = document.body.clientHeight;
const viewportWidth = document.body.clientWidth;

const startGameBtn = document.createElement("button");

startGameBtn.innerText = "Start Game";
startGameBtn.style.height = "60px"
startGameBtn.style.width = "100px"
startGameBtn.style.alignSelf = "center"
startGameBtn.style.margin = "auto"

document.body.appendChild(startGameBtn);


startGameBtn.onclick = () => {
    document.body.removeChild(startGameBtn);
    game.createCanvas(viewportWidth, viewportHeight);

    game.enableProfiler = true;

    game.ctx.imageSmoothingEnabled = false;
    game.loadScene(CollisionTestScene,true);
    
}