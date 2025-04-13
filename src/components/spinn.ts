import Component from "../engine/core/component.js";
import GameObject from "../engine/core/game-object.js";
import game from "../engine/core/game.js";
import { Rect2D } from "../engine/default-components/rect2d.js";
import ShapeRenderer2D from "../engine/default-components/shape-renderer.js";
import Transform from "../engine/math/transform.js";


export default class Spinn implements Component{
    transform!: Transform;
    testObjectsCount: number = 2000;

    start(): void {
        
    }
    
    update(): void {
        //this.transform.rotation += 0.01;
    }
}