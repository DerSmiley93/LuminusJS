import GameObject from "../core/game-object.js";
import game from "../core/game.js";
import Collider2D from "../default-components/collider-2d.js";
import Vector2 from "../math/vector2.js";
import CollisionInfo from "../types/collision-info.js";
import { QuadTree } from "./quad-tree.js";

export default class PhysicsSolver {
    qt: QuadTree

    constructor(public debugDraw: boolean, private qtNodeMaxObjects: number) {
        this.qt = new QuadTree(100, 100, new Vector2(0, 0), qtNodeMaxObjects);
    }

    update(gameObjects: GameObject[]) {
        const colliders = this.buildQuadTree(gameObjects);
        this.solveCollisions(colliders);
    }


    buildQuadTree(gameObjects: GameObject[]): Collider2D[] {
        let qtSize = 0;

        const colliders: Collider2D[] = []

        for (let i = 0; i < gameObjects.length; i++) {
            if (!gameObjects[i].hasComponent(Collider2D)) continue

            const collider = gameObjects[i].getComponent(Collider2D);
            if (!collider) throw new Error("No Collider this should not happen");

            const colliderDistance = Math.max(
                Math.sqrt(Math.pow(collider.colliderShape.transform.worldPosition.x, 2)),
                Math.sqrt(Math.pow(collider.colliderShape.transform.worldPosition.y, 2))
            );

            if (colliderDistance > qtSize) {
                qtSize = colliderDistance;
            }
            colliders.push(collider);
        }

        if (qtSize == 0) {
            qtSize = game.ctx.canvas.width;
        }

        this.qt = new QuadTree(qtSize * 2, qtSize * 2, Vector2.zero(), this.qtNodeMaxObjects);

        colliders.forEach(collider => {
            this.qt?.insertObject(collider);
        })

        if (this.debugDraw) this.qt.show();

        return colliders;
    }

    private solveCollisions(colliders: Collider2D[]) {

        colliders.forEach(collider => {
            const others = this.qt.query(collider);

            const collisions: CollisionInfo[] = [];


            for (let i = 0; i < others.length; i++) {
                const other = others[i];

                if (other === collider) continue;

                if (this.aabb(collider, other)) {
                    
                    const collision = this.sat(collider, other);

                    if (!collision) continue;
                    if (this.checkDuplicateCollision(collisions, collision)) continue;

                    collisions.push(collision);
                }
            }

        });

    }


    private checkDuplicateCollision(collisions: CollisionInfo[], collision: CollisionInfo): boolean {
        throw new Error("not Implemented");
    }

    private sat(a: Collider2D, b: Collider2D): CollisionInfo | undefined{
        throw new Error("not Implemented");
    }

    private aabb(a: Collider2D, b: Collider2D): boolean {
        const aTransform = a.colliderShape.transform;
        const bTransform = b.colliderShape.transform;

        const aBounds = a.colliderShape.getBoundingBox();
        const bBounds = b.colliderShape.getBoundingBox();

        if(
            aTransform.worldPosition.x + aBounds.halfWidth > bTransform.worldPosition.x - bBounds.halfWidth &&
            aTransform.worldPosition.x - aBounds.halfWidth < bTransform.worldPosition.x + bBounds.halfWidth &&
            aTransform.worldPosition.y + aBounds.halfHeight > bTransform.worldPosition.y - bBounds.halfHeight &&
            aTransform.worldPosition.y - aBounds.halfHeight < bTransform.worldPosition.y + bBounds.halfHeight 

        ){
            return true;
        }
        

        return false;
    }
}