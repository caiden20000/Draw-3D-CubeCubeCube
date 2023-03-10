import { Canvas } from './ClassCanvas';
import { Color } from './ClassColor';
import { PositionalObject } from './ClassPositionalObject';

interface Drawable {
  strokeColor: Color;
  fillColor: Color;
  setColor(color: Color);
  getStrokeColor(): Color;
  setStrokeColor(strokeColor: Color);
  getFillColor(): Color;
  setFillColor(fillColor: Color);

  draw(canvas: Canvas);
}

abstract class Renderable extends PositionalObject implements Drawable {
  public strokeColor: Color;
  public fillColor: Color;
  constructor(x: number, y: number, z: number) {
    super(x, y, z);
    this.fillColor = Color.PURPLE();
    this.strokeColor = Color.GREEN();
  }

  setColor(color: Color) {
    this.fillColor = color;
    this.strokeColor = color;
  }

  getStrokeColor(): Color {
    return this.strokeColor;
  }

  setStrokeColor(strokeColor: Color) {
    this.strokeColor = strokeColor;
  }

  getFillColor(): Color {
    return this.fillColor;
  }

  setFillColor(fillColor: Color) {
    this.fillColor = fillColor;
  }

  applyColor(canvas: Canvas) {
    canvas.setColor(this.fillColor, this.strokeColor);
  }

  abstract draw(canvas: Canvas): void;
}
