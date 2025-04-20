import game from "../core/game.js";
import { Asset } from "./asset.js";

export class AudioAsset implements Asset{
    buffer?: ArrayBuffer;
    audioBuffer?: AudioBuffer;
    path: string;
    name: string;
    constructor(path:string,name:string){
        this.path = path; this.name = name;
    }

    async laod(): Promise<void> {
        const response = await fetch(this.path);
        if(!response.ok) throw new Error(`Failed to load audio: ${this.path}`);

        this.buffer = await response.arrayBuffer();
        this.audioBuffer = await game.audioContext.decodeAudioData(this.buffer);
    }

}