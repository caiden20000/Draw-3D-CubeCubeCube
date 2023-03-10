import { Canvas } from './ClassCanvas';
import { Point } from './ClassPoint';
import { Renderable } from './ClassRenderable';

export { DrawablePoint };

class DrawablePoint extends Renderable {
  constructor(public point: Point, public size: number = 6) {
    super(point.x, point.y, point.z);
  }

  draw(canvas: Canvas) {
    let proj = canvas.screen.projectPoint(this.point);
    this.applyColor(canvas);
    canvas.ctx.fillRect(
      proj.x - this.size / 2,
      proj.y - this.size / 2,
      this.size,
      this.size
    );
  }
}
