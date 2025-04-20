import Camera from "./engine/default-components/camera.js";
import GameObject from "./engine/core/game-object.js";
import Scene from "./engine/core/scene.js";
import Transform from "./engine/math/transform.js";
import Spinn from "./components/spinn.js";
import { SpriteRenderer } from "./engine/default-components/sprite-renderer.js";
import { AssetManager } from "./engine/external/asset-manager.js";
import { Sprite } from "./engine/external/sprite.js";
import { CameraController } from "./components/cameraControler.js";
import Scale from "./engine/math/scale.js";
import { SpriteAtlas } from "./engine/external/sprite-atlas.js";
import { AudioEmitter } from "./engine/default-components/audio-emitter.js";
import { AudioAsset } from "./engine/external/audio-asset.js";

const assets = new AssetManager([
    new Sprite('/assets/sprites/testSprite.png', 'testSprite'),
    new SpriteAtlas('/assets/sprites/testSprite.png','atlasTest',3,3),
    new AudioAsset('/assets/audio/testAudio.wav',"testAudio")
]);

const mainCamera = new GameObject('MainCamera', [
    new Camera(1),
    new CameraController(),
],new Transform());

const testObject = new GameObject('TestObject', [
    new SpriteRenderer('testSprite'),
    new AudioEmitter({loop:true}),
    new Spinn()
],new Transform(),1);


testObject.transform.scale = new Scale(1,1);

const testScene = new Scene([
    mainCamera,
    testObject
], assets);

export default testScene;