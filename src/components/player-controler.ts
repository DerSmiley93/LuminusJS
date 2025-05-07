import Component from "../engine/core/component.js";
import game from "../engine/core/game.js";
import Collider2D from "../engine/default-components/collider-2d.js";
import Transform from "../engine/math/transform.js";
import Vector2 from "../engine/math/vector2.js";
import CollisionInfo from "../engine/types/collision-info.js";

export class PlayerControler implements Component {
    isRender: boolean = false;
    transform!: Transform;


    mousePos: Vector2 = Vector2.zero()

    onCollide(collisionInfo: CollisionInfo) {
    }

    start(): void {
        game.ctx.canvas.onmousemove = (e) => {
            this.mousePos.x = e.clientX - game.ctx.canvas.width / 2;
            this.mousePos.y = e.clientY - game.ctx.canvas.height / 2;
        }

        const collider = this.transform.gameObject.getComponent(Collider2D);

        collider?.onCollide(this.onCollide.bind(this))
    }

    update(): void {
        this.transform.worldPosition = this.mousePos.clone();
    }
}