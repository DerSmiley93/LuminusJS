import GameObject from "../engine/core/game-object.js";
import Scene from "../engine/core/scene.js";
import Camera from "../engine/default-components/camera.js";
import Collider2D from "../engine/default-components/collider-2d.js";
import ShapeRenderer2D from "../engine/default-components/shape-renderer.js";
import { Metric } from "../engine/math/metrics.js";
import Transform from "../engine/math/transform.js";
import Vector2 from "../engine/math/vector2.js";
import CircleColliderShape2D from "../engine/types/circle-collider-shape-2d.js";
import Circle2D from "../engine/types/circle2D.js";
import { Rect2D } from "../engine/types/rect2d.js";
import { CollisionTestObject1 } from "../game-objects/collision-test-object1.js";
import { CollisionTestObject2 } from "../game-objects/collision-test-object2.js";
import { CollisionTestObject3 } from "../game-objects/collision-test-object3.js";

export const CollisionTestScene = new Scene([
    CollisionTestObject1,
    CollisionTestObject2,
    CollisionTestObject3,
    new GameObject("MainCamera", [new Camera], new Transform(), 1)
])