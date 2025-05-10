import GameObject from "../core/game-object.js";
import game from "../core/game.js";
import Collider2D from "../default-components/collider-2d.js";
import Vector2 from "../math/vector2.js";
import CollisionInfo from "../types/collision-info.js";
import { QuadTree } from "./quad-tree.js";

export default class PhysicsSolver {
  qt: QuadTree;

  constructor(public debugDraw: boolean, private qtNodeMaxObjects: number) {
    this.qt = new QuadTree(100, 100, new Vector2(0, 0), qtNodeMaxObjects);
  }

  update(gameObjects: GameObject[]) {
    const colliders = this.buildQuadTree(gameObjects);
    this.solveCollisions(colliders);
  }

  buildQuadTree(gameObjects: GameObject[]): Collider2D[] {
    let qtSize = 0;

    const colliders: Collider2D[] = [];

    for (let i = 0; i < gameObjects.length; i++) {
      if (!gameObjects[i].hasComponent(Collider2D)) continue;

      const collider = gameObjects[i].getComponent(Collider2D);
      if (!collider) throw new Error("No Collider this should not happen");

      const colliderDistance = Math.max(
        Math.sqrt(
          Math.pow(collider.colliderShape.transform.worldPosition.x, 2)
        ),
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

    this.qt = new QuadTree(
      qtSize * 2,
      qtSize * 2,
      Vector2.zero(),
      this.qtNodeMaxObjects
    );

    colliders.forEach((collider) => {
      this.qt?.insertObject(collider);
    });

    if (this.debugDraw) this.qt.show();

    return colliders;
  }

  private solveCollisions(colliders: Collider2D[]) {

    let openCollisions: {
      collider: Collider2D;
      collisionInfo: CollisionInfo;
    }[] = this.getCollisions(colliders);

    let solvedCollisions: {
      collider: Collider2D;
      collisionInfo: CollisionInfo;
    }[] = [];

    let i = 0;

    while (!(openCollisions.length == 0 || i >= 100)) {

      solvedCollisions = [];
      openCollisions = this.getCollisions(colliders);
      for (let i = 0; i < openCollisions.length; i++) {
        let collisions = openCollisions[i].collisionInfo.collisions;
        this.seperate(openCollisions[i].collider, collisions);

        solvedCollisions.push(openCollisions[i]);
      }
      i++
    }

    for(const collision of solvedCollisions){
      collision.collider.collide(collision.collisionInfo);
    }
  }

  private seperate(
    collider: Collider2D,
    collisions: { other: Collider2D; seperationVector: Vector2 }[]
  ) {
    for (let i = 0; i < collisions.length; i++) {
      if (collisions[i].other.isTrigger || collider.isTrigger) continue;

      if (collider.fixed) continue;

      if (collisions[i].other.fixed) {
        collider.transform.worldPosition = collider.transform.worldPosition.add(
          collisions[i].seperationVector
        );
      } else {
        collider.transform.worldPosition = collider.transform.worldPosition.add(
          collisions[i].seperationVector.multiply(0.5)
        );
      }
      collider.updateColliderKinematics();
    }
  }

  private getCollisions(
    colliders: Collider2D[]
  ): { collider: Collider2D; collisionInfo: CollisionInfo }[] {

    const openCollisions: {
      collider: Collider2D;
      collisionInfo: CollisionInfo;
    }[] = [];

    for (let i = 0; i < colliders.length; i++) {
      const collisionInfo: CollisionInfo = { collisions: [] };

      let others = this.qt.query(colliders[i]);

      for (let j = 0; j < others.length; j++) {
        if (colliders[i] === others[j]) continue;

        if (this.aabb(colliders[i], others[j])) {
          const collision = this.sat(colliders[i], others[j]);
          if (!collision) continue;
          collisionInfo.collisions.push(collision);
        }
      }

      if (collisionInfo.collisions.length > 0) {
        openCollisions.push({ collider: colliders[i], collisionInfo });
      }

    }

    return openCollisions;
  }

  private sat(
    a: Collider2D,
    b: Collider2D
  ): { other: Collider2D; seperationVector: Vector2 } | undefined {
    let aNormals = a.colliderShape.getNormals();
    let bNormals = b.colliderShape.getNormals();

    const aToB = b.colliderShape.transform.worldPosition
      .subtract(a.colliderShape.transform.worldPosition)
      .normalize();

    let seperationVector: Vector2 = Vector2.zero();
    let minSeperation = 0;

    let aProj = a.colliderShape.projectShape(aToB);
    let bProj = b.colliderShape.projectShape(aToB);

    if (aProj.max > bProj.min && aProj.min < bProj.max) {
      minSeperation = Math.min(
        Math.abs(aProj.max - bProj.min),
        Math.abs(aProj.min - bProj.max)
      );
      seperationVector = aToB.normalize().multiply(-minSeperation / 2);
    } else {
      return undefined;
    }

    for (let i = 0; i < aNormals.length; i++) {
      aProj = a.colliderShape.projectShape(aNormals[i]);
      bProj = b.colliderShape.projectShape(aNormals[i]);

      if (aProj.max > bProj.min && aProj.min < bProj.max) {
        minSeperation = Math.min(
          Math.abs(aProj.max - bProj.min),
          Math.abs(aProj.min - bProj.max)
        );
        seperationVector = aNormals[i].multiply(-minSeperation);
      } else {
        return undefined;
      }
    }

    for (let i = 0; i < bNormals.length; i++) {
      aProj = a.colliderShape.projectShape(bNormals[i]);
      bProj = b.colliderShape.projectShape(bNormals[i]);

      if (aProj.max > bProj.min && aProj.min < bProj.max) {
        minSeperation = Math.min(
          Math.abs(aProj.max - bProj.min),
          Math.abs(aProj.min - bProj.max)
        );
        seperationVector = bNormals[i].multiply(minSeperation);
      } else {
        return undefined;
      }
    }

    return {
      other: b,
      seperationVector,
    };
  }

  private aabb(a: Collider2D, b: Collider2D): boolean {
    const aTransform = a.colliderShape.transform;
    const bTransform = b.colliderShape.transform;

    const aBounds = a.colliderShape.getBoundingBox();
    const bBounds = b.colliderShape.getBoundingBox();

    if (
      aTransform.worldPosition.x + aBounds.halfWidth >
        bTransform.worldPosition.x - bBounds.halfWidth &&
      aTransform.worldPosition.x - aBounds.halfWidth <
        bTransform.worldPosition.x + bBounds.halfWidth &&
      aTransform.worldPosition.y + aBounds.halfHeight >
        bTransform.worldPosition.y - bBounds.halfHeight &&
      aTransform.worldPosition.y - aBounds.halfHeight <
        bTransform.worldPosition.y + bBounds.halfHeight
    ) {
      return true;
    }

    return false;
  }
}
