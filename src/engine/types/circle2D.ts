import IPoint2D from "../math/ipoint2d";
import IShape2D from "./shape2d";
import Vector2 from "../math/vector2.js";

export default class Circle2D implements IShape2D {
  color: string;
  fill: boolean;
  stroke: boolean;
  strokeWidth: number;
  strokeColor: string;
  mesh: IPoint2D[];
  radius: number;

  constructor(
    radius: number,
    color: string = "red",
    strokeColor: string = "black",
    fill: boolean = true,
    stroke: boolean = false,
    strokeWidth: number = 1
  ) {
    this.radius = radius;
    this.color = color;
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;

    // Generate a circular mesh with a default resolution of 32 points
    this.mesh = this.generateMesh(32);
  }

  // Generate a circular mesh with the given resolution
  private generateMesh(resolution: number): IPoint2D[] {
    const points: IPoint2D[] = [];
    for (let i = 0; i < resolution; i++) {
      const angle = (i / resolution) * 2 * Math.PI;
      points.push({
        x: this.radius * Math.cos(angle),
        y: this.radius * Math.sin(angle),
      });
    }
    return points;
  }
}
