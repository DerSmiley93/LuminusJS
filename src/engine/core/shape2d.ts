import IPoint2D from "../math/ipoint2d";

export interface IShape2D {
    color: string;
    fill: boolean;
    stroke: boolean;
    strokeWidth: number;
    strokeColor: string;
    mesh: IPoint2D[];
}