import { Angle } from './ClassAngle';
import { Vector } from './ClassVector';
import { Quad } from './ClassQuad';
import { Position } from './Components';

export { Frustum };

class Frustum {
  public xDom: number;
  public yDom: number;
  public xScalingFactor: number;
  public yScalingFactor: number;
  constructor(
    public width: number,
    public height: number,
    public alpha: Angle = Angle.fromDegrees(45),
    public beta: Angle = Angle.fromDegrees(45)
  ) {
    this.xDom = width / 2;
    this.yDom = height / 2;
    this.updateScalingFactors();
  }

  // Used to have these calls in getDomAtZ.
  // Probably sped things up caching these values.
  // Not like they ever change anyway, 'cept FOV stuff
  updateScalingFactors() {
    this.xScalingFactor =
      Math.sin(this.alpha.radians) /
      Math.sin(Angle.Deg90().difference(this.alpha).radians);
    this.yScalingFactor =
      Math.sin(this.beta.radians) /
      Math.sin(Angle.Deg90().difference(this.beta).radians);
  }

  getDomAtZ(z: number): Vector {
    if (z < 0) return new Vector(0, 0, z);
    let dx = z * this.xScalingFactor;
    let dy = z * this.yScalingFactor;
    //console.log(dx);
    if (isNaN(dx) || !isFinite(dx)) dx = 0;
    if (isNaN(dy) || !isFinite(dy)) dy = 0;
    return new Vector(this.xDom + dx, this.yDom + dy, z);
  }

  // TODO: OPTIMIZATION IDEA
  // domain at any Z is an expansion factor * z * domain at z=0
  // Just store the expansion factor.
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
