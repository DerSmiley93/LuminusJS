import Component from "../core/component.js";
import GameObject from "../core/game-object.js";
import Transform from "../math/transform.js";

export default class Camera implements Component{
    public isRender: boolean = false;
    zoom: number;
    transform!: Transform;

    constructor(zoom: number = 1) {
        this.zoom = zoom;
    }
    
    
    start(): void {
        
    }
    
    update(): void {

    }

}