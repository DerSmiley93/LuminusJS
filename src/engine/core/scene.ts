import Camera from "../default-components/camera.js";
import { AssetManager } from "../external/asset-manager.js";
import Scale from "../math/scale.js";
import Vector2 from "../math/vector2.js";
import Component from "./component.js";
import GameObject from "./game-object.js";
import game from "./game.js";


export default class Scene {

    isLoaded: boolean = false;
    assetManager:AssetManager;

    gameObjects: GameObject[];
    activeCamera?: GameObject
    private lasGameObjectCount: number = 0;


    constructor(gameObjects: GameObject[], assets?: AssetManager) {
        this.gameObjects = gameObjects;
        this.lasGameObjectCount = gameObjects.length;

        this.assetManager = assets ? assets : new AssetManager([]);

        for (const gameObject of gameObjects) {
            if (gameObject.hasComponent(Camera)) {
                this.activeCamera = gameObject;
                break;
            }
        }
    }

    findComponents<T extends Component>(componentType: new (...args: any[]) => T): T[]{
        const components: T[] = [];

        for (const gameObject of this.gameObjects){
            for (const component of gameObject.components){
                if(component instanceof componentType){
                    components.push(component as T);
                }
            }
        }
        return components;
    }

    async load(): Promise<void>{
        console.log("loading Scene!")
        await this.assetManager.loadAssets();

        this._sortZIndex();
        for (const gameObject of this.gameObjects) {
            gameObject.start();
            this._updateKinematics();
        }
        
        this.isLoaded = true;
        console.log("scene loading done!")
    }

    async loadAsync(): Promise<void>{
        console.log("loading scene")
        await this.assetManager.loadAssets();
        for(const gameObject of this.gameObjects) {
            gameObject.start();
        }
        this._sortZIndex();
        this._updateKinematics();
        this.isLoaded = true;
        console.log("scene loading done!")
    }

    update():void{

        this._updateKinematics();
        if(this.lasGameObjectCount !== this.gameObjects.length){
            this._sortZIndex();
            this.lasGameObjectCount = this.gameObjects.length;
        }

        for (const gameObject of this.gameObjects) {
            gameObject.update();
        }
        
    }


    addGameObject(gameObject: GameObject): void {
        this.gameObjects.push(gameObject);
        gameObject.start();
        this._updateKinematics();
    }

    private _updateKinematics(): void {
    
        for (const gameObject of this.gameObjects) {
            const children = gameObject.transform.children;

            for (const child of children) {
                child.worldPosition = gameObject.transform.worldPosition.add(gameObject.transform.worldScale.scale(child.position.rotate(gameObject.transform.worldRotation)) as Vector2);
                child.worldRotation = gameObject.transform.worldRotation + child.rotation;
                child.worldScale = gameObject.transform.worldScale.scale(child.scale) as Scale;
            }

            if(!gameObject.transform.parent){
                gameObject.transform.worldPosition = gameObject.transform.position;
                gameObject.transform.worldRotation = gameObject.transform.rotation;
                gameObject.transform.worldScale = gameObject.transform.scale;
            }
        }
    }

    private _sortZIndex():void{
        this.gameObjects.sort((a, b) => {
            const aZIndex = a.zIndex;
            const bZIndex = b.zIndex;
            return  aZIndex - bZIndex ;
        });
    }

}