import Camera from "./engine/default-components/camera.js";
import GameObject from "./engine/core/game-object.js";
import Scene from "./engine/core/scene.js";
import Transform from "./engine/math/transform.js";
import ShapeRenderer2D from "./engine/default-components/shape-renderer.js";

import Spinn from "./components/spinn.js";
import { Rect2D } from "./engine/default-components/rect2d.js";
import { SpriteRenderer } from "./engine/default-components/sprite-renderer.js";
import { AssetManager } from "./engine/external/asset-manager.js";
import { Sprite } from "./engine/external/sprite.js";
import { CameraController } from "./components/cameraControler.js";
import Vector2 from "./engine/math/vector2.js";
import Scale from "./engine/math/scale.js";
import { SpriteAtlas } from "./engine/external/sprite-atlas.js";

const assets = new AssetManager([
    new Sprite('/assets/sprites/testSprite.png', 'testSprite'),
    new SpriteAtlas('atlasTes','/assets/sprites/testSprite.png',3,3)
]);

const mainCamera = new GameObject('MainCamera', [
    new Camera(1),
    new CameraController()
],new Transform());

const testObject = new GameObject('TestObject', [
    new SpriteRenderer(''),
    new ShapeRenderer2D(new Rect2D(32,32,'green',"blue",false,true,1)),
    new Spinn()
],new Transform(),1);


testObject.transform.scale = new Scale(2,2);

const testScene = new Scene([
    mainCamera,
    testObject
], assets);

export default testScene;