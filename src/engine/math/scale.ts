import IPoint2D from "./ipoint2d.js";
import Vector2 from "./vector2.js";

export default class Scale implements IPoint2D {
    x: number;
    y: number;

    constructor(x: number = 1, y: number = 1) {
        this.x = x;
        this.y = y;
    }

    static zero(): Scale {
        return new Scale(0, 0);
    }

    static one(): Scale {
        return new Scale(1, 1);
    }

    static clone(scale: Scale): Scale {
        return new Scale(scale.x, scale.y);
    }

    scale(target:IPoint2D): IPoint2D {
        if (target instanceof Scale) {
            return new Scale(this.x * target.x, this.y * target.y);
        } else {
            return new Vector2(this.x * target.x, this.y * target.y);
        }
    }

    divide(target:IPoint2D): IPoint2D {
        if (target instanceof Scale) {
            return new Scale(this.x / target.x, this.y / target.y);
        } else {
            return new Vector2(this.x / target.x, this.y / target.y);
        }
    }

    multiply(scalar: number): IPoint2D {
        
        return new Scale(this.x * scalar, this.y * scalar);
    }

    add(scale: IPoint2D): IPoint2D {
        if (scale instanceof Scale) {
            return new Scale(this.x + scale.x, this.y + scale.y);
        } else {
            return new Vector2(this.x + scale.x, this.y + scale.y);
        }
    }
}