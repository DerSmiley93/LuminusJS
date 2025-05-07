
import Scene from "./scene.js";


class Game {
    public scene?: Scene;
    private newScene?: Scene;
    private _ctx!: CanvasRenderingContext2D;
    private frameStart:number = performance.now();
    private frameEnd:number = performance.now();
    

    public enableProfiler: boolean = false;
    public audioContext = new AudioContext();
    public volume:number = 0.5

    public deltaTime:number = 0.0167;
    public time:number = 0;

    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }


    update() {
        //calculating Deltatime
        this.frameEnd = performance.now();
        this.deltaTime = (this.frameEnd - this.frameStart) / 1000;
        this.time += this.deltaTime;
        this.frameStart = performance.now();

        //Main Gameloop
        this._ctx.clearRect(-this._ctx.canvas.width / 2, -this._ctx?.canvas.height / 2, this._ctx.canvas.width, this._ctx.canvas.height);

        //enables seamless switch
        if(this.newScene?.isLoaded){
            this.scene = this.newScene;
            this.newScene = undefined;
        }

        //only updates if scene is loadet and a scene exists
        if(this.scene && this.scene.isLoaded){
            this.scene.update();
        }
        requestAnimationFrame(this.update.bind(this))
        
    }

    async loadScene(scene: Scene, async = false) {

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
    
}

export default new Game();