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
            let collisionInfo: CollisionInfo = { collisions: [] }
            const others = this.qt.query(collider);

            for (let i = 0; i < others.length; i++) {
                if (others[i] === collider) continue;
                if (this.aabb(collider, others[i])) {
                    const collision = this.sat(collider, others[i]);
                    if (!collision) continue;

                    collisionInfo.collisions.push(collision);
                }
            }

            if (collisionInfo.collisions.length > 0) {
                collider.collide(collisionInfo);
            }
        });



    }


    private sat(a: Collider2D, b: Collider2D): { other: Collider2D, seperationVector: Vector2 } | undefined {
        let aNormals = a.colliderShape.getNormals();
        let bNormals = b.colliderShape.getNormals();

        const aToB = b.colliderShape.transform.worldPosition.subtract(
            a.colliderShape.transform.worldPosition
        ).normalize();

        let seperationVector: Vector2 = Vector2.zero();
        let minSeperation = 0;

        let aProj = a.colliderShape.projectShape(aToB);
        let bProj = b.colliderShape.projectShape(aToB);

        if (aProj.max > bProj.min && aProj.min < bProj.max) {

            minSeperation = Math.min(Math.abs(aProj.max - bProj.min), Math.abs(aProj.min - bProj.max))
            seperationVector = aToB.normalize().multiply(-minSeperation / 2);

        } else {
            return undefined;
        }

        for (let i = 0; i < aNormals.length; i++) {

            aProj = a.colliderShape.projectShape(aNormals[i]);
            bProj = b.colliderShape.projectShape(aNormals[i]);

            if (aProj.max > bProj.min && aProj.min < bProj.max) {
                minSeperation = Math.min(Math.abs(aProj.max - bProj.min), Math.abs(aProj.min - bProj.max))
                seperationVector = aNormals[i].multiply(-minSeperation);
            } else {
                return undefined;
            }

        }

        for (let i = 0; i < bNormals.length; i++) {
            aProj = a.colliderShape.projectShape(bNormals[i]);
            bProj = b.colliderShape.projectShape(bNormals[i]);

            if (aProj.max > bProj.min && aProj.min < bProj.max) {
                minSeperation = Math.min(Math.abs(aProj.max - bProj.min), Math.abs(aProj.min - bProj.max))
                seperationVector = bNormals[i].multiply(minSeperation);
            } else {
                return undefined;
            }

        }

        return {
            other: b,
            seperationVector
        }

    }

    private aabb(a: Collider2D, b: Collider2D): boolean {
        const aTransform = a.colliderShape.transform;
        const bTransform = b.colliderShape.transform;

        const aBounds = a.colliderShape.getBoundingBox();
        const bBounds = b.colliderShape.getBoundingBox();

        if (
            aTransform.worldPosition.x + aBounds.halfWidth > bTransform.worldPosition.x - bBounds.halfWidth &&
            aTransform.worldPosition.x - aBounds.halfWidth < bTransform.worldPosition.x + bBounds.halfWidth &&
            aTransform.worldPosition.y + aBounds.halfHeight > bTransform.worldPosition.y - bBounds.halfHeight &&
            aTransform.worldPosition.y - aBounds.halfHeight < bTransform.worldPosition.y + bBounds.halfHeight
        ) {
            return true;
        }

        return false;
    }
}