import { PlayerControler } from "../components/player-controler.js";
import GameObject from "../engine/core/game-object.js";
import Collider2D from "../engine/default-components/collider-2d.js";
import ShapeRenderer2D from "../engine/default-components/shape-renderer.js";
import { Metric } from "../engine/math/metrics.js";
import Transform from "../engine/math/transform.js";
import Vector2 from "../engine/math/vector2.js";
import CircleColliderShape2D from "../engine/types/circle-collider-shape-2d.js";
import { Rect2D } from "../engine/types/rect2d.js";

export const CollisionTestObject1 = new GameObject("CollisionTestObject1",[
    new Collider2D(
        new CircleColliderShape2D(
            1 * Metric.METER / 2,
            new Transform()
        ),
        true,
        true
    ),
    new PlayerControler()
],new Transform(),1)