import { Color } from './ClassColor';
import { Angle } from './ClassAngle';
import { Point } from './ClassPoint';
import { Vector } from './ClassVector';
import { Frustum } from './ClassFrustum';

export { Canvas };

class Canvas {
  public ctx: CanvasRenderingContext2D;
  public screen: Frustum;
  public backgroundColor: Color = new Color(0, 0, 0);
  public width;
  public height;
  constructor(
    public canvasElement: HTMLCanvasElement,
    public fov: Angle = Angle.fromDegrees(90)
  ) {
    this.width = canvasElement.width;
    this.height = canvasElement.height;
    this.screen = new Frustum(this.width, this.height, fov, fov);
    this.ctx = canvasElement.getContext('2d');
    // Set origin in center
    this.ctx.translate(this.screen.xDom, this.screen.yDom);
    // Also make positive y go up
    this.ctx.scale(1, -1);
  }

  clear() {
    this.ctx.clearRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    this.drawBackgroundColor();
  }

  setColor(fill: Color, stroke: Color = fill) {
    this.ctx.fillStyle = fill.toString();
    this.ctx.strokeStyle = stroke.toString();
  }

  setBackgroundColor(color: Color) {
    this.backgroundColor = color;
    this.drawBackgroundColor();
  }

  drawBackgroundColor() {
    this.setColor(this.backgroundColor);
    this.ctx.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
  }

  drawArrowHead(point: Point, vec: Vector, size: number) {
    this.ctx.beginPath();
  }
}