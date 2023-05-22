import { Color } from './ClassColor';
import { Point } from './ClassPoint';
import { Vector } from './ClassVector';

export { Canvas };

class Canvas {
  public ctx: CanvasRenderingContext2D;
  public backgroundColor: Color = new Color(0, 0, 0);
  public width;
  public height;
  constructor(public canvasElement: HTMLCanvasElement) {
    this.width = canvasElement.width;
    this.height = canvasElement.height;
    this.ctx = canvasElement.getContext('2d');
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
}
