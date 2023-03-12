import { Color } from './ClassColor';
import { DrawablePoint } from './ClassDrawablePoint';
import { Point } from './ClassPoint';
import { Poly } from './ClassPoly';
import { Renderable } from './ClassRenderQueue';
import { Vector } from './ClassVector';

export { DrawableVector };

class DrawableVector extends Poly {
  public tipVisible: boolean = true;
  constructor(public origin: Point, public tip: Point) {
    super([origin, tip]);
    this.style.setColor(Color.GREEN);
  }

  static fromVector(origin: Point, vector: Vector, length: number = 50) {
    vector.normalize();
    vector.multiplyNum(length);
    vector.add(origin.toVector());

    return new DrawableVector(origin, vector.toPoint());
  }

  static asNormal(poly: Poly, length: number = 50) {
    return DrawableVector.fromVector(poly.position.toPoint(), poly.getNormal());
  }

  getVector(): Vector {
    return Vector.fromPositions(this.origin.position, this.tip.position);
  }

  drawTip(tipVisible: boolean): DrawableVector {
    this.tipVisible = tipVisible;
    return this;
  }

  stage(objects: Renderable[]) {
    objects.push(this);
    if (this.tipVisible) objects.push(new DrawablePoint(this.tip));
  }
}
