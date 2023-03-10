import { Angle } from './ClassAngle';
import { Canvas } from './ClassCanvas';
import { Point } from './ClassPoint';
import { Renderable } from './ClassRenderable';
import { Vector } from './ClassVector';
import { Axis } from './EnumAxis';

export { Poly };

class Poly extends Renderable {
  public rotation: Angle;
  constructor(public points: Point[] = []) {
    //if (points.length < 3) return;
    super(0, 0, 0);
    let center = this._determineCenter();
    this.x = center.x;
    this.y = center.y;
    this.z = center.z;
    this.rotation = new Angle(0);
  }

  _determineCenter(): Point {
    let avg = new Point(0, 0, 0);
    for (let p of this.points) {
      avg.x += p.x;
      avg.y += p.y;
      avg.z += p.z;
    }
    let numberOfPoints = this.points.length;
    avg.x /= numberOfPoints;
    avg.y /= numberOfPoints;
    avg.z /= numberOfPoints;
    return avg;
  }

  getCenter() {
    return new Point(this.x, this.y, this.z);
  }

  getRotation(pivot: Point, axis: Axis) {
    if (pivot == this.getCenter()) return this.rotation;
    return super.getRotation(pivot, axis);
  }

  setRotation(pivot: Point, axis: Axis, angle: Angle) {
    if (pivot.equals(this.getCenter())) this.rotation = angle;
    for (let p of this.points) p.rotate(pivot, axis, angle);
    return super.setRotation(pivot, axis, angle);
  }

  rotate(pivot: Point, axis: Axis, angle: Angle) {
    if (pivot.equals(this.getCenter())) return super.rotate(pivot, axis, this.rotation.add(angle));
    return super.rotate(pivot, axis, angle);
  }

  getPosition() {
    return super.getPosition();
  }

  setPosition(point: Point) {
    let diff = this.getCenter().getDiff(point);
    for (let p of this.points) p.translate(diff.toVector());
    this.x = point.x;
    this.y = point.y;
    this.z = point.z;

    return this;
  }

  translate(vec: Vector) {
    for (let p of this.points) p.translate(vec);
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
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
