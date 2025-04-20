import { Asset } from "./asset.js";

export class AssetManager{
    public isLoaded: boolean = false;

    private assets: Map<string, Asset> = new Map<string, Asset>();
    public loadingProgress: number = 0;

    constructor(assets: Asset[]){
        for(const asset of assets){
            this.assets.set(asset.name, asset);
        }
    }

    public getAsset<T extends Asset>(name: string): T{
        const asset = this.assets.get(name);
        if(asset === undefined){
            throw new Error(`Asset not found: ${name}`);
        }
        return asset as T;
    }


    public async loadAssets(): Promise<void>{
        const promises: Promise<void>[] = [];
        for( const asset of this.assets.values()){
            promises.push(asset.laod());
        }

        this.loadingProgress = 0;

        let loadedCount = 0;

        for (const promise of promises) {
            promise.then(() => {
                loadedCount++;
                this.loadingProgress = loadedCount / promises.length;
            });
        }
        
        await Promise.all(promises);

        this.isLoaded = true;
        
    }


}