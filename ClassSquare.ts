import { Point } from './ClassPoint';
import { Quad } from './ClassQuad';

export { Square };

class Square extends Quad {
  constructor(public centerPoint: Point, public size: number) {
    let hs = size / 2;
    let pp = new Point(hs, hs, 0);
    let pn = new Point(hs, -hs, 0);
    let np = new Point(-hs, hs, 0);
    let nn = new Point(-hs, -hs, 0);
    super(pp, np, nn, pn);
    this.translate(centerPoint.toVector());
  }
}
