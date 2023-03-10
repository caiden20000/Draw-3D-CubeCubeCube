import { Point } from './ClassPoint';
import { Vector } from './ClassVector';
import { Angle } from './ClassAngle';
import { Canvas } from './ClassCanvas';
import { RenderQueue } from './ClassRenderQueue';
import { Renderable } from './ClassRenderable';
import { Axis } from './EnumAxis';
import { Positional } from './ClassPositionalObject';

export { Quad };

class Poly extends Renderable {
  public rotation: Angle;
  constructor(public points: Point[]) {
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
    if (pivot == this.getCenter()) this.rotation = angle;
    for (let p of this.points) p.rotate(pivot, axis, angle);
    return super.setRotation(pivot, axis, angle);
  }

  rotate(pivot: Point, axis: Axis, angle: Angle) {
    if (pivot == this.getCenter()) {
      this.rotation.add(angle);
      for (let p of this.points) p.rotate(pivot, axis, this.rotation);
      return super.rotate(pivot, axis, this.rotation);
    }
    for (let p of this.points) p.rotate(pivot, axis, angle);
    return super.rotate(pivot, axis, angle);
  }

  getPosition() {
    return super.getPosition();
  }

  setPosition(point: Point) {
    let diff = this.getCenter().distanceTo(point);
    for (let p of this.points) p.translate(diff.);
    this.x = point.x;
    this.y = point.y;
    this.z = point.z;

    return this;
  }
  
}

class Quad extends Renderable {
  public points: Point[];
  public centerPoint: Point;
  constructor(
    public p1: Point,
    public p2: Point,
    public p3: Point,
    public p4: Point
  ) {
    let points = [p1, p2, p3, p4];
    let avg = new Point(0, 0, 0);
    for (let p of points) {
      avg.x += p.x;
      avg.y += p.y;
      avg.z += p.z;
    }
    let numberOfPoints = points.length;
    avg.x /= numberOfPoints;
    avg.y /= numberOfPoints;
    avg.z /= numberOfPoints;
    super(avg.x, avg.y, avg.z);

    this.points = points;
    this.centerPoint = avg;
  }

  // cube rotating faster than Square by like x3, but this is called ONCE for each quad in the scene. Issue may be in p.rotate()
  rotate(pivot: Point, axis: Axis, angle: Angle): Positional {
    for (let p of this.points) p.rotate(pivot, axis, angle);
    return this;
  }

  translate(vec: Vector): Positional {
    for (let p of this.points) p.translate(vec);
    return this;
  }

  floor(): Quad {
    for (let p of this.points) p.floor();
    this.centerPoint = this._getCenter();
    return this;
  }

  _getCenter(): Point {
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

  // Generates normal vector assuming all 4 points are on a plane
  get normal(): Vector {
    let v1 = Vector.fromPoints(this.p1, this.p2);
    let v2 = Vector.fromPoints(this.p1, this.p4);
    let n = Vector.crossProduct(v1, v2);
    n.invert();
    return n;
  }

  draw(canvas: Canvas) {
    let projQuad = canvas.screen.projectQuad(this);
    //projQuad.floor();
    this.applyColor(canvas);
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(projQuad.p1.x, projQuad.p1.y);
    canvas.ctx.lineTo(projQuad.p2.x, projQuad.p2.y);
    canvas.ctx.lineTo(projQuad.p3.x, projQuad.p3.y);
    canvas.ctx.lineTo(projQuad.p4.x, projQuad.p4.y);
    canvas.ctx.closePath();
    canvas.ctx.fill();
    canvas.ctx.stroke();
  }

  drawNormal(renderQueue: RenderQueue) {
    renderQueue.addRenderable(new DrawableVector(this.normal, this.getCenter()));
  }
}
