import GameObject from "../core/game-object.js";
import game from "../core/game.js";
import Collider2D from "../default-components/collider-2d.js";
import Vector2 from "../math/vector2.js";
import { QuadTree } from "./quad-tree.js";

export default class PhysicsSolver{
    qt?:QuadTree
    constructor(public debugDraw:boolean,private qtNodeMaxObjects:number){

    }

    update(gameObjects:GameObject[]){
        const colliders = this.buildQuadTree(gameObjects);
        this.checkCollision(colliders);
    }


    buildQuadTree(gameObjects:GameObject[]):Collider2D[]{
        let qtSize = 0;

        const colliders:Collider2D[] = []

        for(let i = 0; i < gameObjects.length; i++){
            if(!gameObjects[i].hasComponent(Collider2D)) continue

            const collider = gameObjects[i].getComponent(Collider2D);
            if(!collider) throw new Error("No Collider this should not happen");

            const colliderDistance = Math.max(
                Math.sqrt(Math.pow(collider.colliderShape.transform.worldPosition.x,2)),
                Math.sqrt(Math.pow(collider.colliderShape.transform.worldPosition.y,2))
            );

            if(colliderDistance > qtSize){
                qtSize = colliderDistance;
            }
            colliders.push(collider);
        }

        if(qtSize == 0){
            qtSize = game.ctx.canvas.width;
        }

        this.qt = new QuadTree(qtSize*2,qtSize*2,Vector2.zero(),this.qtNodeMaxObjects);

        colliders.forEach(collider => {
            this.qt?.insertObject(collider);
        })

        if(this.debugDraw) this.qt.show();

        return colliders;
    }

    private checkCollision(colliders:Collider2D[]){
        if(!this.qt) return false;

        colliders.forEach( collider => {
            const others = this.qt?.query(collider);
            
        })
    }
}