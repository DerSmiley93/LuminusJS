import Component from "../core/component.js";
import game from "../core/game.js";
import { AudioAsset } from "../external/audio-asset.js";
import Transform from "../math/transform.js";
import { AudioEmitterOptions } from "../types/audio-emitter-options.js";

export class AudioEmitter implements Component {
    public transform!: Transform;
    private panner!: PannerNode;
    private track!: AudioBufferSourceNode
    private audioAsset?:AudioAsset;
    
    constructor(private options:AudioEmitterOptions,private assetName:string){
        
    }

    start(): void {
        this.panner = new PannerNode(game.audioContext,{
            panningModel:this.options.panningModel || "HRTF",
            distanceModel:this.options.distanceModel || "linear",
            positionX:this.transform.worldPosition.x,
            positionY:this.transform.worldPosition.y,
            positionZ:this.options.positionZ || -100,
            orientationX:this.options.orientationX || 0,
            orientationY:this.options.orientationY || 0,
            orientationZ: this.options.orientationZ || 1,
            rolloffFactor:this.options.rollOff || 10,
            coneInnerAngle:this.options.innerConeAngle || 40,
            coneOuterAngle:this.options.outerConeAngle || 180,
            coneOuterGain:this.options.outerGain || 0.3
        })

        this.audioAsset = game.scene!.assetManager.getAsset(this.assetName);
        if(!this.audioAsset) throw new Error("Audio not correctly initialized");
        if(!this.audioAsset.buffer) throw new Error("Audio not correctly initialized");

        
        this.track = new AudioBufferSourceNode(game.audioContext,{buffer:this.audioAsset.audioBuffer})
        this.track.connect(this.panner).connect(new GainNode(game.audioContext,{gain: game.volume})).connect(game.audioContext.destination);
        this.track.loop = this.options.loop || false;
    }

    update(): void {
        this.panner.positionX.value = this.transform.worldPosition.x;
        this.panner.positionY.value = this.transform.worldPosition.y;
    }

    playAudio(){
        this.track.start();
    }

    stopAudio(){
        this.track.stop();
    }

}