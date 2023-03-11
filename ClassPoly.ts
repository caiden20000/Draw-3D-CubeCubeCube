import { Angle } from './ClassAngle';
import { Camera } from './ClassCamera';
import { Canvas } from './ClassCanvas';
import { Point } from './ClassPoint';
import { Renderable } from './ClassRenderable';
import { Vector } from './ClassVector';
import { Position, Rotation, Style } from './Components';
import { Axis } from './EnumAxis';

export { Poly };

class Poly {
  public position: Position;
  public rotation: Rotation;
  public style: Style;
  constructor(public points: Point[] = []) {
    this.position = Position.fromPoints(points);
    this.rotation = new Rotation(
      this.position,
      Rotation.getRotationArrayFromPoints(this.points)
    );
  }

  draw(camera: Camera) {
    let projectedPositions: Position[] = [];
    let ctx = camera.canvas.ctx;
    for (let p of this.points)
      projectedPositions.push(camera.frustum.projectPosition(p.position));

    this.style.applyColor(camera.canvas);
    ctx.beginPath();
    ctx.moveTo(projectedPositions[0].x, projectedPositions[0].y);
    for (let pp of projectedPositions) ctx.lineTo(pp.x, pp.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  /**
   * Minimum of 3 points, else returns Zero vector
   */
  getNormal(): Vector {
    if (this.points.length < 3) return new Vector(0, 0, 0);
    let v1 = Vector.fromPoints(this.points[0], this.points[1]);
    let v2 = Vector.fromPoints(
      this.points[0],
      this.points[this.points.length - 1]
    );
    let n = Vector.crossProduct(v1, v2);
    //n.invert();
    return n;
  }
}
