import Component from "../engine/core/component.js";
import GameObject from "../engine/core/game-object.js";
import game from "../engine/core/game.js";
import { AudioEmitter } from "../engine/default-components/audio-emitter.js";
import { Rect2D } from "../engine/default-components/rect2d.js";
import ShapeRenderer2D from "../engine/default-components/shape-renderer.js";
import { Metric } from "../engine/math/metrics.js";
import Transform from "../engine/math/transform.js";


export default class Spinn implements Component {
    transform!: Transform;
    testObjectsCount: number = 2000;
    toggle: boolean = false;

    start(): void {
        let audioEmitter = this.transform.gameObject.getComponent(AudioEmitter);
        if (!AudioEmitter) return;

        audioEmitter?.playAudio();
    }

    update(): void {

        if(this.transform.position.x > Metric.METER && this.toggle){
            this.toggle = !this.toggle;
        }

        if(this.transform.position.x < -Metric.METER && !this.toggle){
            this.toggle = !this.toggle;
        }

        if (this.toggle) {
            this.transform.position.x += 10;
        } else {
            this.transform.position.x -= 10;
        }
    }
}