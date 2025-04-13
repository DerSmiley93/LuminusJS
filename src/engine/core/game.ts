
import { Profiler } from "../debug/profiler.js";
import Scene from "./scene.js";


class Game {
    public scene?: Scene;
    private newScene?: Scene;
    private _ctx!: CanvasRenderingContext2D;

    private onFrameEndListeners: (() => void)[] = [];
    private onFrameStartListeners: (() => void)[] = [];

    public enableProfiler: boolean = false;
    public profiler?: Profiler;

    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }




    update() {
    
        this.onFrameEndListeners.forEach((callback) => callback());
        this.onFrameStartListeners.forEach((callback) => callback());

        this._ctx.clearRect(-this._ctx.canvas.width / 2, -this._ctx?.canvas.height / 2, this._ctx.canvas.width, this._ctx.canvas.height);

        if(this.newScene?.isLoaded){
            this.scene = this.newScene;
            this.newScene = undefined;
        }

        if(this.scene && this.scene.isLoaded){
            this.scene.update();
        }

 

        requestAnimationFrame(this.update.bind(this));
    }

    async loadScene(scene: Scene, async = false) {
        if(this.enableProfiler) this.profiler = new Profiler();

        if(!this.ctx) this.createCanvas(500,500);

        if (async) {
            if(this.scene){
                this.newScene = scene;
            }
            else{
                this.scene = scene;
            }

            scene.loadAsync();
        }
        else {
            this.scene = scene;
            await this.scene.load();
        }

        this.update();
    }

    createCanvas(width:number,height:number): void{
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        
        this._ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this._ctx.translate(this._ctx.canvas.width / 2, this._ctx.canvas.height / 2);
        document.body.appendChild(canvas);
    } 
    
    
    onFrameStart(callback: () => void) {
        this.onFrameStartListeners.push(callback);
    }

    onFrameEnd(callback: () => void) {
        this.onFrameEndListeners.push(callback);
    }

    
}

export default new Game();