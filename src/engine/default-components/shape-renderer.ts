import Component from "../core/component.js";
import GameObject from "../core/game-object.js";
import game from "../core/game.js";
import  IShape2D  from "../core/shape2d.js";
import IPoint2D from "../math/ipoint2d.js";
import Scale from "../math/scale.js";
import Transform from "../math/transform.js";
import Vector2 from "../math/vector2.js";
import Camera from "./camera.js";



export default class ShapeRenderer2D implements Component {

    camera?: Camera;
    transform!: Transform;
    shape:IShape2D;

    constructor(shape:IShape2D){
        this.shape = shape;
    }

    start(): void {
        this.camera  = game.scene?.activeCamera?.getComponent<Camera>(Camera);
    }

    update(): void {
        
        if(!game.ctx) throw new Error("Canvas not found");

        const ctx = game.ctx;

        ctx.save();

        ctx.beginPath();

        const mesh = this.shape.mesh;

        let firstPoint = this.getTransformedPoint(mesh[0]);
        ctx.moveTo(firstPoint.x, firstPoint.y);

        for(let i = 1; i < mesh.length; i++){
            const point = this.getTransformedPoint(mesh[i]);
            ctx.lineTo(point.x, point.y);
        }

        ctx.lineTo(firstPoint.x, firstPoint.y); // Close the shape

        ctx.closePath();

        //TODO: ctx.fillStyle = this.shape.color.toString();

        if(this.shape.fill){
            ctx.fillStyle = this.shape.color;
            ctx.fill();
        }

        if(this.shape.stroke){
            ctx.lineWidth = this.shape.strokeWidth * this.camera?.zoom! * (this.transform.scale.x + this.transform.scale.y) / 2;
            ctx.strokeStyle = this.shape.strokeColor;
            ctx.stroke();
        }

        ctx.restore();
        
    } 


    private getTransformedPoint(point:IPoint2D):Vector2{
        if(!this.camera?.transform.gameObject) throw new Error("Camera not found");
        if(!this.transform.gameObject) throw new Error("GameObject not found");
        if(!this.transform) throw new Error("Transform not found");

        const cameraTransform = this.camera.transform;
        const gameObjectTransform = this.transform;
        let transformedPoint:Vector2 = point as Vector2;

        let scale = gameObjectTransform.worldScale;

        transformedPoint = (scale as Scale).scale(point) as Vector2;
        
        transformedPoint = transformedPoint
            .rotate(gameObjectTransform.worldRotation)
            .add(gameObjectTransform.worldPosition)

        //add cameraTransform
        
        transformedPoint = transformedPoint.subtract(cameraTransform.worldPosition);
        transformedPoint = transformedPoint.rotate(-cameraTransform.worldRotation);
        transformedPoint = transformedPoint.multiply(this.camera.zoom);

        return transformedPoint;
    }

}