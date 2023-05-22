import { Canvas } from './ClassCanvas';
import { Color } from './ClassColor';
import { Point } from './ClassPoint';
import { Square } from './ClassSquare';

export { DrawablePoint };

class DrawablePoint extends Square {
  constructor(public point: Point, public size: number = 6) {
    super(point.position.x, point.position.y, point.position.z, size);
    this.style.setColor(Color.PURPLE);
  }
}
