import Vector2 from "../math/vector2.js";
import { Asset } from "./asset.js";
import { Sprite } from "./sprite.js";

export class SpriteAtlas implements Asset {
    buffer?: ArrayBuffer | undefined;
    path: string;
    name: string;

    private columns: number;
    private rows: number;
    private srcImage?: HTMLImageElement;

    sprites: Sprite[] = [];

    constructor(path: string, name: string, columns: number, rows: number) {
        this.name = name;
        this.path = path;
        this.columns = columns;
        this.rows = rows;
    }

    async laod(): Promise<void> {
        const response = await fetch(this.path);

        if (!response.ok) throw new Error("could not load: " + this.path);

        let blob = await response.blob()
        this.buffer = await blob.arrayBuffer();

        const url = URL.createObjectURL(blob);

        this.srcImage = new Image();
        this.srcImage.src = url;

        return new Promise((reslove) => {
            this.srcImage!.onload = async() => {
                await this.createSprites()

                reslove();
            }
        })
    }


    private async createSprites(): Promise<void> {
        const imageCanvas = document.createElement("canvas");
        const ctx = imageCanvas.getContext("2d") as CanvasRenderingContext2D

        imageCanvas.height = this.srcImage!.height;
        imageCanvas.width = this.srcImage!.width;

        ctx.drawImage(this.srcImage!, 0, 0);
        const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height).data;

        const tileSize = new Vector2(
            Math.floor(imageCanvas.width / this.columns),
            Math.floor(imageCanvas.height / this.rows)
        );

        const tilesImageData: Uint8ClampedArray[] = new Array(this.columns * this.rows);


        //creating buffer for new sprites
        for (let i = 0; i < tilesImageData.length; i++) {
            tilesImageData[i] = new Uint8ClampedArray(tileSize.x * tileSize.y * 4);
        }

        //looping over image to create tiles
        for (let i = 0, pixelIndex = 0; i < imageData.length; i += 4) {
            const R = imageData[i];
            const G = imageData[i + 1];
            const B = imageData[i + 2];
            const A = imageData[i + 3];

            const pixelCords = new Vector2(
                pixelIndex % imageCanvas.width,
                Math.floor(pixelIndex / imageCanvas.height)
            );

            const tileCords = new Vector2(
                Math.floor((pixelCords.x / imageCanvas.width) * this.columns),
                Math.floor((pixelCords.y / imageCanvas.height) * this.rows)
            )

            const tileIndex = (tileCords.x * this.columns) + tileCords.y;

            const tilePixelCords = new Vector2(pixelCords.x % tileSize.x, pixelCords.y % tileSize.y);

            const tilePixelIndex = (tilePixelCords.y * tileSize.x + tilePixelCords.x) * 4;

            tilesImageData[tileIndex][tilePixelIndex] = R;
            tilesImageData[tileIndex][tilePixelIndex + 1] = G;
            tilesImageData[tileIndex][tilePixelIndex + 2] = B;
            tilesImageData[tileIndex][tilePixelIndex + 3] = A;

            pixelIndex++;
        }
        for(let i = 0; i < tilesImageData.length; i++){
            const tileData = new ImageData(tilesImageData[i],tileSize.x,tileSize.y);
            const tile = await this.createImageFromImageData(tileData);
            const sprite = new Sprite('',this.name + i.toString())
            sprite.image = tile;
            this.sprites.push(sprite);
        }
        
    }

    private async createImageFromImageData(imageData:ImageData):Promise<HTMLImageElement>{
        const canvas = document.createElement('canvas');

        canvas.height = imageData.height;
        canvas.width = imageData.width;

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.putImageData(imageData,0,0);

        const image = new Image(imageData.width, imageData.height);
        image.src = canvas.toDataURL("image/png");

        return new Promise((resolve) => {
            image.onload = () => {
                resolve(image)
            }
        })
    }
}