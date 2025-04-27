import IPoint2D from "../math/ipoint2d.js";
import { Metric } from "../math/metrics.js";
import Scale from "../math/scale.js";
import Transform from "../math/transform.js";
import Vector2 from "../math/vector2.js";
import IColliderShape2D from "./collider-shape-2d";

export default class CircleColliderShape2D implements IColliderShape2D {

    constructor(public radius: number, public transform: Transform) { }

    getNormals(): Vector2[] {
        return [];
    }

    projectShape(axis: Vector2): { min: number; max: number; } {
        const min = axis.dot(this.transform.worldPosition) - this.radius;
        const max = axis.dot(this.transform.worldPosition) + this.radius;

        return { min, max };
    }

    getBoundingBox(): {halfWidth:number,halfHeight:number,verts:IPoint2D[]} {
        const halfWidth = this.radius * this.transform.scale.x;
        const halfHeight = this.radius * this.transform.scale.x;

        const x = this.transform.worldPosition.x;
        const y = this.transform.worldPosition.y;

        const verts = [
            new Vector2(x - halfWidth, y - halfHeight),
            new Vector2(x - halfWidth, y + halfHeight),
            new Vector2(x + halfWidth, y + halfHeight),
            new Vector2(x + halfWidth, y - halfHeight)
        ];

        return {halfWidth,halfHeight,verts}
    }

    debugDraw(ctx:CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.transform.worldPosition.x,this.transform.worldPosition.y,this.radius,0,Metric.DEGREE * 360);
        ctx.strokeStyle = "blue";
        ctx.stroke();

        const bounds = this.getBoundingBox();
        ctx.strokeStyle = "magenta";
        ctx.strokeRect(
            this.transform.worldPosition.x - bounds.halfWidth,
            this.transform.worldPosition.y - bounds.halfHeight,
            bounds.halfWidth * 2, 
            bounds.halfHeight * 2
        )

        ctx.beginPath();
        ctx.arc(this.transform.worldPosition.x,this.transform.worldPosition.y,this.radius * 2,0,Metric.DEGREE * 360);
        ctx.strokeStyle = "gray";
        ctx.stroke();

        ctx.restore();


    }
}