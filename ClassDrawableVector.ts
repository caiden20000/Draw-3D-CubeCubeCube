import { Canvas } from './ClassCanvas';
import { Point } from './ClassPoint';
import { Poly } from './ClassPoly';
import { Vector } from './ClassVector';

export { DrawableVector };

class DrawableVector extends Poly {
  constructor(public origin: Point, public tip: Point) {
    super([origin, tip]);
  }

  static fromVector(origin: Point, vector: Vector, length: number = 50) {
    vector.normalize();
    vector.multiplyNum(length);
    vector.add(origin.toVector());

    return new DrawableVector(origin, vector.toPoint());
  }

  getVector(): Vector {
    return Vector.fromPoints(this.origin, this.tip);
  }

  draw(canvas: Canvas) {
    let projectedOrigin = canvas.screen.projectPoint(this.origin);
    let projectedTip = canvas.screen.projectPoint(this.tip);
    this.applyColor(canvas);
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(projectedOrigin.x, projectedOrigin.y);
    canvas.ctx.lineTo(projectedTip.x, projectedTip.y);
    canvas.ctx.closePath();
    canvas.ctx.stroke();
  }
}
