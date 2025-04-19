export interface AudioEmitterOptions  {
    panningModel?: PanningModelType;
    innerConeAngle?: number;
    outerConeAngle?:number;
    outerGain?: number;
    distanceModel?: DistanceModelType;
    maxDistance?: number;
    refDistance?: number;
    rollOff?: number;
    positionZ?:number;
    orientationX?:number;
    orientationY?:number;
    orientationZ?:number;
    loop?:boolean;
}