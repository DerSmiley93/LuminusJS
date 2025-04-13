import { Asset } from "./asset.js";

export class Sprite implements Asset{
    buffer?: ArrayBuffer;
    path: string;
    name: string;
    image?: HTMLImageElement;

    constructor(path: string,name: string){
        this.name = name;
        this.path = path;
    }

    async laod(): Promise<void> {
        const ressponse = await fetch(this.path);
        if(!ressponse.ok){
            throw new Error(`Failed to load sprite: ${this.path}`);
        }

        const blob = await ressponse.blob();
        this.buffer = await blob.arrayBuffer();
        const url = URL.createObjectURL(blob);
        this.image = new Image();
        this.image.src = url;

        return new Promise((resolve) => {
            this.image!.onload = () => {
                URL.revokeObjectURL(url);
                resolve();
            };
        });
    }

}