import { Canvas } from './ClassCanvas';
import { Point } from './ClassPoint';

export { DrawablePoint };

class DrawablePoint extends Renderable {
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
