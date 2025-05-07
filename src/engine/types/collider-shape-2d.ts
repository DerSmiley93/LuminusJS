import IPoint2D from "../math/ipoint2d.js";
import Scale from "../math/scale.js";
import Transform from "../math/transform.js";
import Vector2 from "../math/vector2.js";

export default interface IColliderShape2D{
    
    transform: Transform;

    projectShape(axis: Vector2): {min:number, max:number};

    getBoundingBox(): {halfWidth:number,halfHeight:number,verts:IPoint2D[]};

    getNormals(): Vector2[];

    debugDraw(ctx:CanvasRenderingContext2D):void;
}