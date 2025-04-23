import Component from "../core/component.js";
import game from "../core/game.js";
import GameObject from "../core/game-object.js";
import { Sprite } from "../external/sprite.js";
import Camera from "./camera.js";
import Transform from "../math/transform.js";
import Vector2 from "../math/vector2.js";
import { SpriteAtlas } from "../external/sprite-atlas.js";

export class SpriteRenderer implements Component {

    camera?: Camera;
    transform!: Transform;
    spriteName: string;
    sprite?: Sprite;

    //TODO: maybe refactor or rewrite. for now its working
    constructor(spriteName: string) {
        this.spriteName = spriteName;
    }

    start(): void {
        if(this.spriteName != ''){
            const spriteAsset = game.scene?.assetManager.getAsset(this.spriteName);
            if(spriteAsset instanceof SpriteAtlas){
                this.sprite = spriteAsset.sprites[0];
            }else{
                this.sprite = spriteAsset;
            }
        }


        this.camera = game.scene?.activeCamera?.getComponent<Camera>(Camera);
    }

    update(): void {
        if (this.spriteName != '') {
            if (!this.sprite) throw new Error("Sprite not correctly initialized");
            
            if (!this.sprite.image) throw new Error("Sprite not correctly initialized");
            if (!this.camera) throw new Error("Camera not found");

            const transform = this.transform;
            const cameraTransform = this.camera.transform;
            const ctx = game.ctx;

            const width = this.sprite.image.width * transform.scale.x * this.camera.zoom;
            const height = this.sprite.image.height * transform.scale.y * this.camera.zoom;
            ctx.save();


            let transformedPosition = this.transform.worldPosition.clone();

            transformedPosition = transformedPosition.subtract(cameraTransform.worldPosition).multiply(this.camera.zoom);

            ctx.rotate(-cameraTransform.worldRotation);
            ctx.translate(transformedPosition.x, transformedPosition.y);
            ctx.rotate(this.transform.worldRotation)


            ctx.drawImage(this.sprite.image, -width / 2, -height / 2, width, height);


            ctx.restore();
        }

    }

}