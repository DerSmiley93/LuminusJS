import Collider2D from "../default-components/collider-2d.js";
import IPoint2D from "../math/ipoint2d.js";

export default interface CollisionInfo{
    collisions:{other:Collider2D,collisionPoint:IPoint2D}[]
}