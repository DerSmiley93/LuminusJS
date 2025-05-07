import IShape2D  from "./shape2d.js";
import Vector2 from "../math/vector2.js";

export class Rect2D implements IShape2D{

    color: string;
    fill: boolean;
    stroke: boolean;
    strokeWidth: number;
    strokeColor: string;
    mesh: Vector2[];
    //TODO: create config type for constructor
    constructor(public width: number, public height:number,color:string = 'red', strokeColor:string = 'black', fill:boolean = true, stroke:boolean = false, strokeWidth:number = 1){
        this.color = color;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.strokeColor = strokeColor;

        const halfWidth = width / 2;
        const halfHeight = height / 2;

        this.mesh = [
            new Vector2( -halfWidth, -halfHeight),
            new Vector2( -halfWidth, halfHeight),
            new Vector2( halfWidth,  halfHeight),
            new Vector2( halfWidth, -halfHeight),
        ]
    }

}