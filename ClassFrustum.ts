import { Angle } from './ClassAngle';
import { Vector } from './ClassVector';
import { Quad } from './ClassQuad';
import { Position } from './Components';

export { Frustum };

class Frustum {
  public xDom: number;
  public yDom: number;
  constructor(
    public width: number,
    public height: number,
    public alpha: Angle = Angle.fromDegrees(45),
    public beta: Angle = Angle.fromDegrees(45)
  ) {
    this.xDom = width / 2;
    this.yDom = height / 2;
  }

  // Returns a vector pointing to the corner fo the first quadrant of
  // the finite plane bounded by the frustum angled planes
  // ie. the X and Y components are 1/2 width and height of face at that Z value
  getDomAtZ(z: number): Vector {
    if (z < 0) return new Vector(0, 0, z);
    let dx =
      (z * Math.sin(this.alpha.radians)) /
      Math.sin(Angle.Deg90().difference(this.alpha).radians);
    let dy =
      (z * Math.sin(this.beta.radians)) /
      Math.sin(Angle.Deg90().difference(this.beta).radians);
    //console.log(dx);
    if (isNaN(dx) || !isFinite(dx)) dx = 0;
    if (isNaN(dy) || !isFinite(dy)) dy = 0;
    return new Vector(this.xDom + dx, this.yDom + dy, z);
  }

  projectPosition(p: Position): Position {
    let pDom = this.getDomAtZ(p.z);
    //console.log(pDom);
    // Normalize point position with (p.x / pDom.x), then project by multiplying this.xDom
    let projected = new Position(
      (p.x * this.xDom) / pDom.x,
      (p.y * this.yDom) / pDom.y,
      0
    );
    return projected;
  }

  isPositionInFrustum(p: Position): boolean {
    if (p.z < 0) return false;
    let pDom = this.getDomAtZ(p.z);
    if (Math.abs(p.x) <= pDom.x && Math.abs(p.y) <= pDom.y) return true;
    return false;
  }

  // Returns true if 1 or more points of quad is in frustum
  isPolyInFrustum(quad: Quad): boolean {
    for (let p of quad.points) {
      if (this.isPositionInFrustum(p.position)) return true;
    }
    return false;
  }
}
