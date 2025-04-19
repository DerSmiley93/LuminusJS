import GameObject from "../core/game-object.js";
import Scale from "./scale.js";
import Vector2 from "./vector2.js";

export default class Transform{
    gameObject!:GameObject
    parent?: Transform;
    children: Transform[];

    worldPosition: Vector2;
    worldRotation: number; // in radians
    worldScale: Scale;

    position: Vector2;
    rotation: number; // in radians
    scale: Scale;

    up:Vector2 = new Vector2(0,1)
    down:Vector2 = new Vector2(0,-1);
    right:Vector2 = new Vector2(1,0);
    left:Vector2 = new Vector2(-1,0);

    constructor(position: Vector2 = new Vector2(0, 0), rotation: number = 0, scale?:Scale, parent?: Transform) {
        this.parent = parent || undefined;
        this.children = [];
        
        this.up = this.up.rotate(rotation);
        this.down = this.down.rotate(rotation);
        this.left = this.left.rotate(rotation);
        this.right = this.right.rotate(rotation);
        
        this.position = position;
        this.rotation = rotation;
        this.scale = scale || new Scale(1, 1);

        this.worldPosition = this.position;
        this.worldRotation = this.rotation;
        this.worldScale = this.scale;


        if (parent) {
            parent.children.push(this);
        }
    }

    setParent(parent: Transform): void {
        this.parent = parent;
        parent.children.push(this);
    }

    removeParent(): void {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1) {
                this.parent.children.splice(index, 1);
            }
            this.parent = undefined;
        }
    }

    updateDirections(){
        this.up = this.up.rotate(this.rotation);
        this.down = this.down.rotate(this.rotation);
        this.left = this.left.rotate(this.rotation);
        this.right = this.right.rotate(this.rotation);
    }
}