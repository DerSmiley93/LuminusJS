import IPoint2D from "../math/ipoint2d.js";
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

    getBoundingBox(): IPoint2D[] {
        const halfWidth = this.radius * this.transform.scale.x;
        const halfHeight = this.radius * this.transform.scale.x;

        const x = this.transform.worldPosition.x;
        const y = this.transform.worldPosition.y;

        return [
            new Vector2(x - halfWidth, y - halfHeight),
            new Vector2(x - halfWidth, y + halfHeight),
            new Vector2(x + halfWidth, y + halfHeight),
            new Vector2(x + halfWidth, y - halfHeight)
        ];
    }
}