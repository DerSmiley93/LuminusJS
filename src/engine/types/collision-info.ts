import Collider2D from "../default-components/collider-2d.js";
import Vector2 from "../math/vector2.js";

export default interface CollisionInfo{
    collisions:{other:Collider2D,seperationVector:Vector2}[]
}