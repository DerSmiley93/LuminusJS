import GameObject from "../engine/core/game-object.js";
import Scene from "../engine/core/scene.js";
import Camera from "../engine/default-components/camera.js";
import Collider2D from "../engine/default-components/collider-2d.js";
import { Metric } from "../engine/math/metrics.js";
import Transform from "../engine/math/transform.js";
import Vector2 from "../engine/math/vector2.js";
import CircleColliderShape2D from "../engine/types/circle-collider-shape-2d.js";
import { CollisionTestObject1 } from "../game-objects/collision-test-object1.js";
import { CollisionTestObject2 } from "../game-objects/collision-test-object2.js";

export const CollisionTestScene = new Scene([
    CollisionTestObject1,
    CollisionTestObject2,
    new GameObject(
        "collider3",
        [
            new Collider2D(
                new CircleColliderShape2D(1 * Metric.METER, new Transform()),
                false,
                true,
                true
            )
        ],
        new Transform(new Vector2(10,10)),
        1
    ),
    new GameObject("MainCamera", [new Camera], new Transform(), 1)
])