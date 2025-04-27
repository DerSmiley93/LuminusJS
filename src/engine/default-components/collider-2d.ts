import Component from "../core/component.js";
import game from "../core/game.js";
import Scale from "../math/scale.js";
import Transform from "../math/transform.js";
import IColliderShape2D from "../types/collider-shape-2d.js";
import CollisionInfo from "../types/collision-info.js";

export default class Collider2D implements Component{
    transform!: Transform;
    
    collisionEventHandlers:Function[] = []

    constructor(public colliderShape:IColliderShape2D,public isTrigger:boolean,public debugDraw?:boolean){

    }
    
    start(): void {

    }

    update(): void {
        this.updateColliderKinematics();
        if(this.debugDraw)this.draw(); 
    }

    private updateColliderKinematics(){
        this.colliderShape.transform.worldPosition = this.colliderShape.transform.position.add(this.transform.worldPosition);
        this.colliderShape.transform.worldRotation = this.colliderShape.transform.rotation + this.transform.worldRotation;
        this.colliderShape.transform.worldScale = this.colliderShape.transform.scale.scale(this.transform.worldScale) as Scale;
        this.colliderShape.transform.updateDirections();
    }

    public onCollide(handler:()=>{}){
        this.collisionEventHandlers.push(handler);
    }

    public collide(collisionInfo:CollisionInfo){
        this.collisionEventHandlers.forEach(handler => {
            handler();
        })
    }

    private draw(){
        this.colliderShape.debugDraw(game.ctx)
    }

}