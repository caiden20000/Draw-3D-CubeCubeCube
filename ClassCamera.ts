import { Angle } from './ClassAngle';
import { Canvas } from './ClassCanvas';
import { Frustum } from './ClassFrustum';
import { Point } from './ClassPoint';
import { Position, Rotation } from './Components';

export { Camera };

class Camera {
  public position: Position;
  public Rotation: Rotation;
  public frustum: Frustum;
  constructor(
    public canvas: Canvas,
    public horizontalFOV = Angle.fromDegrees(45),
    public verticalFOV = horizontalFOV
  ) {
    this.frustum = new Frustum(
      canvas.width,
      canvas.height,
      horizontalFOV,
      verticalFOV
    );

    this.position = new Position(0, 0, 0);
    this.Rotation = new Rotation(this.position);

    // Set origin in center
    this.canvas.ctx.translate(this.frustum.xDom, this.frustum.yDom);
    // Also make positive y go up
    this.canvas.ctx.scale(1, -1);
  }

  toCameraSpace(pos: Position): Position {
    // TODO
    return pos;
  }

  fromCameraSpaceToScreenSpace(pos: Position): Position {
    return this.frustum.projectPosition(pos);
  }

  // When drawing a shape, call toScreenSpace to find true drawing points.
  // Returns null if not on screen; ie don't draw if return null
  // Null override for when calling for poly
  toScreenSpace(pos: Position, nullOverride: boolean = false): Position {
    if (!this.isVisible(pos) && !nullOverride) return null;
    return this.fromCameraSpaceToScreenSpace(this.toCameraSpace(pos));
  }

  // Returns null if not on screen; ie don't draw if return null
  // Null override for ultimate power :)
  polyToScreenSpace(
    posArr: Position[],
    nullOverride: boolean = false
  ): Position[] {
    if (!this.isPolyVisible(posArr) && !nullOverride) return null;
    let screenPosArr: Position[] = [];
    for (let p of posArr) screenPosArr.push(this.toScreenSpace(p, true));
    return screenPosArr;
  }

  isVisible(pos: Position): boolean {
    let cameraPos = this.toCameraSpace(pos);
    return this.frustum.isPositionInFrustum(pos);
  }

  isPolyVisible(posArr: Position[]): boolean {
    for (let p of posArr) {
      if (this.frustum.isPositionInFrustum(this.toCameraSpace(p))) return true;
    }
    return false;
  }
}
