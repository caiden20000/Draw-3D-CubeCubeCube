import { Colorable, Drawable, Positional, Axis } from './CommonTypes';
import { Point } from './ClassPoint';
import { Vector } from './ClassVector';
import { Angle } from './ClassAngle';
import { Canvas } from './ClassCanvas';
import { RenderQueue } from './ClassRenderQueue';

export { Quad };

class Quad extends Colorable implements Drawable, Positional {
  constructor(
    public p1: Point,
    public p2: Point,
    public p3: Point,
    public p4: Point
  ) {
    super();
  }

  get points(): Point[] {
    return [this.p1, this.p2, this.p3, this.p4];
  }

  // cube rotating faster than Square by like x3, but this is called ONCE for each quad in the scene. Issue may be in p.rotate()
  rotate(pivot: Point, axis: Axis, angle: Angle) {
    for (let p of this.points) p.rotate(pivot, axis, angle);
  }

  translate(vec: Vector) {
    for (let p of this.points) p.translate(vec);
  }

  floor() {
    for (let p of this.points) p.floor();
  }

  get center(): Point {
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

  getPos(): Point {
    return this.center;
  }

  drawNormal(renderQueue: RenderQueue) {
    renderQueue.addRenderable(new DrawableVector(this.normal, this.center));
  }
}
