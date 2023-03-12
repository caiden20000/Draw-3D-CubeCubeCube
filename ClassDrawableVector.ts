import { Color } from './ClassColor';
import { Point } from './ClassPoint';
import { Poly } from './ClassPoly';
import { Vector } from './ClassVector';

export { DrawableVector };

class DrawableVector extends Poly {
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
}
