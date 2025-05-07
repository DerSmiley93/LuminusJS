import Component from "../core/component.js";
import game from "../core/game.js";
import { AudioAsset } from "../external/audio-asset.js";
import Transform from "../math/transform.js";
import { AudioEmitterOptions } from "../types/audio-emitter-options.js";

export class AudioEmitter implements Component {
    public isRender: boolean = false;
    public transform!: Transform;
    private panner!: PannerNode;
    private track!: AudioBufferSourceNode
    public audioAsset?: AudioAsset;

    //TODO: needs rework and better code structuring.
    constructor(private options: AudioEmitterOptions) {

    }

    start(): void {
        this.panner = new PannerNode(game.audioContext, {
            panningModel: this.options.panningModel || "HRTF",
            distanceModel: this.options.distanceModel || "linear",
            positionX: this.transform.worldPosition.x,
            positionY: this.transform.worldPosition.y,
            positionZ: this.options.positionZ || -100,
            orientationX: this.options.orientationX || 0,
            orientationY: this.options.orientationY || 0,
            orientationZ: this.options.orientationZ || 1,
            rolloffFactor: this.options.rollOff || 10,
            coneInnerAngle: this.options.innerConeAngle || 40,
            coneOuterAngle: this.options.outerConeAngle || 180,
            coneOuterGain: this.options.outerGain || 0.3
        })
        
        this.track = new AudioBufferSourceNode(game.audioContext);
        this.track.connect(this.panner).connect(new GainNode(game.audioContext, { gain: game.volume })).connect(game.audioContext.destination);
        this.track.loop = this.options.loop || false;
    }

    update(): void {
        this.panner.positionX.value = this.transform.worldPosition.x;
        this.panner.positionY.value = this.transform.worldPosition.y;
    }

    playAudio(audioAsset:AudioAsset) {
        if(!audioAsset.audioBuffer) throw new Error("Audio Asset not loaded or invalid. can't play audio");
        this.track.buffer = audioAsset.audioBuffer;
        this.track.start();
    }

    stopAudio() {
        this.track.stop();
    }

}