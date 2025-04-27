import IPoint2D from "./ipoint2d.js";

export default class Vector2 implements IPoint2D {
    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    clone(): Vector2{
        return new Vector2(this.x, this.y);
    }

    add(v: Vector2): Vector2{
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector2): Vector2{
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    multiply(scalar: number): Vector2{
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number): Vector2{
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    dot(v: Vector2): number{
        return this.x * v.x + this.y * v.y;
    }

    length(): number{
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    rotate(angle: number): Vector2{
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    normalize(): Vector2{
        const length = this.length();
        if(length === 0) return new Vector2(0, 0);
        return new Vector2(this.x / length, this.y / length);
    }

    static zero(): Vector2{
        return new Vector2(0, 0);
    }

    static distance(v1: Vector2, v2: Vector2): number{
        return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
    }
}