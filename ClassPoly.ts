import { Angle } from './ClassAngle';
import { Canvas } from './ClassCanvas';
import { Point } from './ClassPoint';
import { Renderable } from './ClassRenderable';
import { Vector } from './ClassVector';
import { Position, Rotation } from './Components';
import { Axis } from './EnumAxis';

export { Poly };

class Poly {
  public position: Position;
  public rotation: Rotation;
  constructor(public points: Point[] = []) {
    this.position = Position.fromPoints(points);
    this.rotation = new Rotation(this.position, Rotation.getRotationArrayFromPoints(this.points));
  }

  draw(canvas: Canvas) {
    let projectedPoints: Point[] = [];
    for (let p of this.points)
      projectedPoints.push(canvas.screen.projectPoint(p));

    this.applyColor(canvas);
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(projectedPoints[0].x, projectedPoints[0].y);
    for (let pp of projectedPoints) canvas.ctx.lineTo(pp.x, pp.y);
    canvas.ctx.closePath();
    canvas.ctx.fill();
    canvas.ctx.stroke();
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
