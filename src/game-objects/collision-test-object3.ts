import GameObject from "../engine/core/game-object.js"
import Collider2D from "../engine/default-components/collider-2d.js"
import ShapeRenderer2D from "../engine/default-components/shape-renderer.js"
import { Metric } from "../engine/math/metrics.js"
import Transform from "../engine/math/transform.js"
import Vector2 from "../engine/math/vector2.js"
import CircleColliderShape2D from "../engine/types/circle-collider-shape-2d.js"
import Circle2D from "../engine/types/circle2D.js"

export const CollisionTestObject3 =  new GameObject(
        "collider3",
        [
            new Collider2D(
                new CircleColliderShape2D(1 * Metric.METER, new Transform()),
                false,
                false,
                false
            ),
            new ShapeRenderer2D(new Circle2D(1*Metric.METER,"red","blue",true,false,1))
        ],
        new Transform(new Vector2(10,10)),
        1
    );