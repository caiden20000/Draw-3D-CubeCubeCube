import { Angle } from './ClassAngle';
import { Point } from './ClassPoint';
import { Vector } from './ClassVector';
import { Axis } from './EnumAxis';

export { PositionalObject, Positional };

interface Positional {
  getRotation(Point, Axis): Angle;
  setRotation(Point, Axis, Angle): Positional;
  rotate(Point, Axis, Angle): Positional;

  getPosition(): Point;
  setPosition(Point): Positional;
  translate(Vector): Positional;
}

class PositionalObject implements Positional {
  constructor(public x, public y, public z) {}

  //
  _getAxisDiff(pivot: Point, axis: Axis) {
    let dx = 0;
    let dy = 0;
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

  setRotation(pivot: Point, axis: Axis, angle: Angle): Positional {
    let diff = this._getAxisDiff(pivot, axis);
    let radius = Math.sqrt(diff.dx ** 2 + diff.dy ** 2);
    let newX = pivot.x + radius * Math.cos(angle.radians);
    let newY = pivot.y + radius * Math.sin(angle.radians);
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

  rotate(pivot: Point, axis: Axis, angle: Angle): Positional {
    let currentAngle = this.getRotation(pivot, axis);
    this.setRotation(pivot, axis, currentAngle.add(angle));
    return this;
  }

  getPosition(): Point {
    return new Point(this.x, this.y, this.z);
  }

  setPosition(point: Point): Positional {
    this.x = point.x;
    this.y = point.y;
    this.z = point.z;
    return this;
  }

  translate(vec: Vector): Positional {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  }
}
