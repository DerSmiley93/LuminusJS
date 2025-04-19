import Component from "../core/component.js";
import game from "../core/game.js";
import Transform from "../math/transform.js";
import { AudioEmitterOptions } from "../types/audio-emitter-options.js";

export class AudioEmitter implements Component {
    public transform!: Transform;

    private panner!: PannerNode;

    constructor(private options:AudioEmitterOptions){
        
    }

    start(): void {
        this.panner = new PannerNode(game.audioContext,{
            panningModel:this.options.panningModel || "HRTF",
            distanceModel:this.options.distanceModel || "linear",
            positionX:this.transform.worldPosition.x,
            positionY:this.transform.worldPosition.y,
            positionZ:this.options.positionZ || 300,
            orientationX:this.options.orientationX || 0,
            orientationY:this.options.orientationY || 0,
            orientationZ: this.options.orientationZ || -1,
            rolloffFactor:this.options.rollOff || 10,
            coneInnerAngle:this.options.innerConeAngle || 360,
            coneOuterAngle:this.options.outerConeAngle || 360,
            coneOuterGain:this.options.outerGain || 0.3
        })
    }

    update(): void {
        this.panner.positionX.value = this.transform.worldPosition.x;
        this.panner.positionY.value = this.transform.worldPosition.y;
    }

}