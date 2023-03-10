import { Point } from './ClassPoint';
import { Color } from './ClassColor';
import { Canvas } from './ClassCanvas';
import { Vector } from './ClassVector';
import { Angle } from './ClassAngle';

export { Drawable, Positional, Renderable, r, r_li, clamp, Axis };

interface Positional {
  translate(Vector);
  getPos(): Point;
  rotate(Point, Axis, Angle);
  //getRot(Axis): Angle; // TODO
}

enum Axis {
  X,
  Y,
  Z,
}

type Renderable = Drawable & Positional;

// Returns random int in range [min, max] inclusive
function r(min: number, max: number): number {
  return Math.round(Math.random() * (max - min)) + min;
}

// Returns random element from the list
function r_li<T>(list: T[]): T {
  return list[r(0, list.length - 1)];
}

function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

abstract class Drawable {
  public strokeColor: Color;
  public fillColor: Color;
  constructor() {
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

interface PositionalFinal {
  getRotation(Point, Axis): Angle;
  setRotation(Point, Axis, Angle): PositionalFinal;
  rotate(Point, Axis, Angle): PositionalFinal;

  getPosition(): Point;
  setPosition(Point): PositionalFinal;
  translate(Vector): PositionalFinal;
}

interface DrawableFinal {
  strokeColor: Color;
  fillColor: Color;
  setColor(color: Color);
  getStrokeColor(): Color;
  setStrokeColor(strokeColor: Color);
  getFillColor(): Color;
  setFillColor(fillColor: Color);

  draw(canvas: Canvas);
}

type RenderableFinal = PositionalFinal & DrawableFinal;

class PositionalObject implements PositionalFinal {
  constructor(public x, public y, public z) {}
  
  //
  _getAxisDiff(pivot: Point, axis: Axis) {
    let dx = 0,
      dy = 0;
    if (axis == Axis.X) {
      dx = this.y - pivot.y;
      dy = this.z - pivot.z;
    } else if (axis == Axis.Y) {
      dx = this.x - pivot.x;
      dy = this.z - pivot.z;
    } else if (axis == Axis.Z) {
      dx = this.x - pivot.x;
      dy = this.y - pivot.y;
    }
    return { dx, dy };
  }

  getRotation(pivot: Point, axis: Axis): Angle {
    let diff = this._getAxisDiff(pivot, axis);
    let currentAngle = new Angle(Math.atan2(diff.dy, diff.dx));
    return currentAngle;
  }

  setRotation(pivot: Point, axis: Axis, angle: Angle): PositionalFinal {
    let diff = this._getAxisDiff(pivot, axis);
    let radius = Math.sqrt(diff.dx ** 2 + diff.dy ** 2);
    let newX = pivot.x + radius * Math.cos(angle.radians);
    let newY = pivot.x + radius * Math.sin(angle.radians);
    if (axis == Axis.X) {
      this.y = newX;
      this.z = newY;
    } else if (axis == Axis.Y) {
      this.x = newX;
      this.z = newY;
    } else if (axis == Axis.Z) {
      this.x = newX;
      this.y = newY;
    }
    return this;
  }

  rotate(pivot: Point, axis: Axis, angle: Angle): PositionalFinal {
    let currentAngle = this.getRotation(pivot, axis);
    this.setRotation(pivot, axis, currentAngle.add(angle));
    return this;
  }

  getPosition(): Point {
    return new Point(this.x, this.y, this.z);
  }

  setPosition(point: Point): PositionalFinal {
    this.x = point.x;
    this.y = point.y;
    this.z = point.z;
    return this;
  }

  translate(vec: Vector): PositionalFinal {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  }
}

// TODO
// I'm currently trying to combine PositionalObject + Drawable
// to make a RenderableObject abstract superclass
// I'm also refactoring the code to draw things with a Drawable extending class that encapsulates Points and Vectors, and the Quad class will extend Drawable
