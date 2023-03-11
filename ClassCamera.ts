import { Angle } from './ClassAngle';
import { Canvas } from './ClassCanvas';
import { Frustum } from './ClassFrustum';
import { Point } from './ClassPoint';
import { PositionalObject } from './ClassPositionalObject';
import { Position, Rotation } from './Components';

export { Camera };

class Camera {
  public position: Position;
  public Rotation: Rotation;
  public frustum: Frustum;
  constructor(public canvas: Canvas, public horizontalFOV = Angle.fromDegrees(45), public verticalFOV = horizontalFOV) {
    this.frustum = new Frustum(canvas.width, canvas.height, horizontalFOV, verticalFOV);

    this.position = new Position(0, 0, 0);
    this.Rotation = new Rotation(this.position);

    // Set origin in center
    this.canvas.ctx.translate(this.frustum.xDom, this.frustum.yDom);
    // Also make positive y go up
    this.canvas.ctx.scale(1, -1);
  }

  toCameraSpace(point: Point): Point {
    // TODO
    return point;
  }

  fromCameraSpaceToScreenSpace(point: Point): Point {
    return point;
  }

  toScreenSpace(point: Point) {
    return this.fromCameraSpaceToScreenSpace(this.toCameraSpace(point));
  }
}
