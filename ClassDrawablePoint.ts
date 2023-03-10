import { Canvas } from './ClassCanvas';
import { Point } from './ClassPoint';
import { Drawable } from './CommonTypes';

export { DrawablePoint };

class DrawablePoint extends Drawable {
  public point: Point;
  constructor(public size: number = 6) {
    super();
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
