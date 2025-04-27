import GameObject from "../core/game-object.js";
import game from "../core/game.js";
import Collider2D from "../default-components/collider-2d.js";
import Vector2 from "../math/vector2.js";
import { QuadTree } from "./quad-tree.js";

export default class PhysicsSolver{
    qt?:QuadTree
    constructor(public debugDraw:boolean){

    }

    update(gameObjects:GameObject[]){
        
        let qtSize = 0;

        const colliders:Collider2D[] = []

        for(let i = 0; i < gameObjects.length; i++){
            if(!gameObjects[i].hasComponent(Collider2D)) continue

            const collider = gameObjects[i].getComponent(Collider2D);
            if(!collider) throw new Error("No Collider this should not happen");

            const colliderDistance = collider?.colliderShape.transform.worldPosition.length()

            if(colliderDistance > qtSize){
                qtSize = colliderDistance;
            }
            colliders.push(collider);
        }

        if(qtSize == 0){
            qtSize = game.ctx.canvas.width;
        }

        this.qt = new QuadTree(qtSize*2,qtSize*2,Vector2.zero(),2);
        colliders.forEach(collider => {
            this.qt?.insetObject(collider);
        })

        if(this.debugDraw) this.qt.show();

        

    }

    private checkCollision(Collider:Collider2D[]){

    }
}