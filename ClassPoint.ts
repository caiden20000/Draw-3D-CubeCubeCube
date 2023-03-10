import { Drawable, Positional, Axis } from './CommonTypes';
import { Angle } from './ClassAngle';
import { Vector } from './ClassVector';

export { Point };

class Point implements Positional {
  static ORIGIN = () => new Point(0, 0, 0);
  constructor(public x: number, public y: number, public z: number) {}

  copy(): Point {
    return new Point(this.x, this.y, this.z);
  }

  distanceTo(point: Point): number {
    let dx = point.x - this.x;
    let dy = point.y - this.y;
    let dz = point.z - this.z;
    return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
  }

  // Does a rotation on the XY plane around a pivot.
  // Is used in the rotate function to rotate on every plane.
  _rotateGeneral(thisX, thisY, pivotX, pivotY, angle: Angle) {
    let dx = thisX - pivotX;
    let dy = thisY - pivotY;
    let radius = Math.sqrt(dx ** 2 + dy ** 2);
    let currentAngle = new Angle(Math.atan2(dy, dx));
    let newX = pivotX + radius * Math.cos(currentAngle.radians + angle.radians);
    let newY = pivotY + radius * Math.sin(currentAngle.radians + angle.radians);
    // We know the problem is in here because
    // return new Point(thisX, thisY, 0) goes alright.
    return new Point(newX, newY, 0);
  }

  rotate(pivot: Point, axis: Axis, angle: Angle) {
    let newPos: Point;
    if (axis == Axis.X) {
      newPos = this._rotateGeneral(this.y, this.z, pivot.y, pivot.z, angle);
      this.y = newPos.x;
      this.z = newPos.y;
    }
    if (axis == Axis.Y) {
      newPos = this._rotateGeneral(this.x, this.z, pivot.x, pivot.z, angle);
      this.x = newPos.x;
      this.z = newPos.y;
    }
    if (axis == Axis.Z) {
      newPos = this._rotateGeneral(this.x, this.y, pivot.x, pivot.y, angle);
      this.x = newPos.x;
      this.y = newPos.y;
    }
  }

  translate(vec: Vector) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
  }

  toVector(): Vector {
    return new Vector(this.x, this.y, this.z);
  }

  getPos(): Point {
    return this;
  }
}
