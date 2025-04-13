import Component from "../engine/core/component.js";
import GameObject from "../engine/core/game-object.js";
import Camera from "../engine/default-components/camera.js";
import { Metric } from "../engine/math/metrics.js";
import Transform from "../engine/math/transform.js";

export class CameraController implements Component{
    transform!: Transform;
    camera?: Camera;

    deltaTime: number = 0;

    lastTime: number = 0;
    time: number = 0;

    timeElapsed: number = 0;

    start(): void {
        this.camera = this.transform.gameObject.getComponent<Camera>(Camera);
        
    }

    update(): void {
        this.lastTime = this.time;
        this.time = performance.now() / 1000;
        this.deltaTime = this.time - this.lastTime;
        this.timeElapsed += this.deltaTime;

        //this.camera!.zoom = Math.sin(this.timeElapsed) * 0.5 + 1;

        this.transform.position.x = Math.sin(this.timeElapsed) * 0.3 * Metric.METER;
       //this.transform.position.y = Math.cos(this.timeElapsed) * 0.3 * Metric.METER;
        
        this.transform.rotation += 0.01;
        
    }
    
}