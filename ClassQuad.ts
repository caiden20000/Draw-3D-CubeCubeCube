import { Point } from './ClassPoint';
import { RenderQueue } from './ClassRenderQueue';
import { Poly } from './ClassPoly';
import { DrawableVector } from './ClassDrawableVector';

export { Quad };

class Quad extends Poly {
  constructor(
    public p1: Point,
    public p2: Point,
    public p3: Point,
    public p4: Point
  ) {
    let points = [p1, p2, p3, p4];
    super(points);
  }

  drawNormal(renderQueue: RenderQueue) {
    renderQueue.addRenderable(
      new DrawableVector(this.getNormal(), this.getCenter())
    );
  }
}
