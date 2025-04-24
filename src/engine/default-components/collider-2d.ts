import Component from "../core/component.js";
import Scale from "../math/scale.js";
import Transform from "../math/transform.js";
import IColliderShape2D from "../types/collider-shape-2d.js";

export default class Collider2D implements Component{
    transform!: Transform;

    constructor(public colliderShape:IColliderShape2D){

    }
    start(): void {

    }

    update(): void {
        this.updateColliderKinematics();
    }

    private updateColliderKinematics(){
        this.colliderShape.transform.worldPosition = this.colliderShape.transform.position.add(this.transform.worldPosition);
        this.colliderShape.transform.worldRotation = this.colliderShape.transform.rotation + this.transform.worldRotation;
        this.colliderShape.transform.worldScale = this.colliderShape.transform.scale.scale(this.transform.worldScale) as Scale;
        this.colliderShape.transform.updateDirections();
    }

}