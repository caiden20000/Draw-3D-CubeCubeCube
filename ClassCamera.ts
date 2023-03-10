import { Angle } from './ClassAngle';
import { Frustum } from './ClassFrustum';
import { Point } from './ClassPoint';
import { PositionalObject } from './ClassPositionalObject';

export { Camera };

class Camera extends PositionalObject {
  public frustum: Frustum;
  constructor(
    public width,
    public height,
    public horizontalFOV = Angle.fromDegrees(45),
    public verticalFOV = horizontalFOV
  ) {
    super(0, 0, 0);
    this.frustum = new Frustum(width, height, horizontalFOV, verticalFOV);
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
