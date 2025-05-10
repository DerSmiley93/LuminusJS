import Component from "../core/component.js";
import game from "../core/game.js";
import Scale from "../math/scale.js";
import Transform from "../math/transform.js";
import IColliderShape2D from "../types/collider-shape-2d.js";
import CollisionInfo from "../types/collision-info.js";

export default class Collider2D implements Component {
    public isRender: boolean = false;
    transform!: Transform;

    collisionEventHandlers: ((collisionInfo: CollisionInfo) => void)[] = []

    constructor(public colliderShape: IColliderShape2D, public isTrigger: boolean, public debugDraw: boolean = false, public fixed = false) {

    }

    start(): void {
    }

    update(): void {
        this.updateColliderKinematics();
        if (this.debugDraw) this.draw();
    }

    public updateColliderKinematics() {
        this.colliderShape.transform.worldPosition = this.colliderShape.transform.position.add(this.transform.worldPosition);
        this.colliderShape.transform.worldRotation = this.colliderShape.transform.rotation + this.transform.worldRotation;
        this.colliderShape.transform.worldScale = this.colliderShape.transform.scale.scale(this.transform.worldScale) as Scale;
        this.colliderShape.transform.updateDirections();
    }

    public onCollide(handler: (collisionInfo: CollisionInfo) => void) {
        this.collisionEventHandlers.push(handler);
    }

    public collide(collisionInfo: CollisionInfo) {
        this.collisionEventHandlers.forEach(handler => {
            handler(collisionInfo);
        })

    }

    private draw() {
        this.colliderShape.debugDraw(game.ctx)
    }

}