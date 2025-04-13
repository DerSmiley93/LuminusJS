export interface Asset {
    buffer?: ArrayBuffer;
    path: string;
    name: string;
    laod(): Promise<void>;
}