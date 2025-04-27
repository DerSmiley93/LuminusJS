import Component from "../engine/core/component.js";
import game from "../engine/core/game.js";
import Transform from "../engine/math/transform.js";
import Vector2 from "../engine/math/vector2.js";

export class PlayerControler implements Component{
    transform!: Transform;

    mousePos:Vector2 = Vector2.zero()

    start(): void {
        game.ctx.canvas.onmousemove = (e) => {
            this.mousePos.x = e.clientX - game.ctx.canvas.width / 2;
            this.mousePos.y = e.clientY - game.ctx.canvas.height / 2;
        }
    }

    update(): void {
        this.transform.position = this.mousePos;
    }

}