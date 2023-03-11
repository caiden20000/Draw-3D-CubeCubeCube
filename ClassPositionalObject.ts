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

/**
 * Position Component.
 */
class Position {
  constructor(public x: number, public y: number, public z: number) {}
  public toPoint = () => new Point(this.x, this.y, this.z);

  set(x: number, y: number, z: number): Position {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  /**
   * Adds x, y, and z to this object.
   * Returns this.
   */
  translate(x: number, y: number, z: number): Position {
    return this.set(this.x + x, this.y + y, this.z + z);
  }

  /**
   * Returns a new Position object with the difference on
   * all axes.
   */
  getDifference(pos: Position): Position {
    return new Position(pos.x - this.x, pos.y - this.y, pos.z - this.z);
  }

  /**
   * Gets the 3D distance from this to pos
   */
  getDistance(pos: Position): number {
    let diff = this.getDifference(pos);
    return Math.sqrt(diff.x**2 + diff.y**2 + diff.z**2);
  }

  /**
   * Returns the distance in 2D on the plane orthogonal to the given axis
   */
  getDistance2D(axis: Axis, pos: Position): number {
    let diff = this.getDifference(pos);
    if (axis == Axis.X) return Math.sqrt(diff.y**2 + diff.z**2);
    if (axis == Axis.Y) return Math.sqrt(diff.x**2 + diff.z**2);
    if (axis == Axis.Z) return Math.sqrt(diff.x**2 + diff.y**2);
  }

  /**
   * True if x, y, and z are equal.
   */
  equals(pos: Position): boolean {
    return pos.x == this.x && pos.y == this.y && pos.z == this.z;
  }
}

/**
 * Size Component.
 * Currently x, y, z is unused.
 */
class Size {
  public x: number; // Width
  public y: number; // Height
  public z: number; // Depth
  constructor (public value: number) {
    this.x = value;
    this.y = value;
    this.z = value;
  }

  set(newValue: number): Size {
    this.value = newValue;
    this.x = newValue;
    this.y = newValue;
    this.z = newValue;
    return this;
  }
}

// Notes about Rotation:
// I can't prove it yet, but I have a strong feeling that
// a rotation about a pivot is IDENTICAL to
// rotating about the center of all the points involved
// and THEN translating the center of the points to the appropriate position.

/**
 * Rotation Component.
 * Can only be implemented on an object with a Position component.
 * Must pass in the Position component upon initialization.
 * Will rotate about any axis.
 * Keeps track of rotations done on the position of the object.
 * Will rotate all Components in the list (useful for Poly, Shape)/
 */
class Rotation {
  public xRotation: Angle;
  public yRotation: Angle;
  public zRotation: Angle;
  // "targets" are any additional objects you want to rotate along with this.
  constructor(public position: Position, public targets: Rotation[] = []) {}

  /**
   * Rotations with this position as the pivot affects the
   * local rotation about the position.
   */
  isLocalRotation(pivot: Position): boolean {
    return this.position.equals(pivot);
  }

  /**
   * Will return the angle from horizontal on the plane orthogonal
   * to the speficied axis.
   * If no pivot is given, returns the local rotation.
   */
  getRotation(axis: Axis, pivot: Position = this.position) {
    if (this.isLocalRotation(pivot)) {
      if (axis == Axis.X) return this.xRotation;
      if (axis == Axis.Y) return this.yRotation;
      if (axis == Axis.Z) return this.zRotation;
    } else {
      let diff = this.position.getDifference(pivot);
      if (axis == Axis.X) return new Angle(Math.atan2(diff.y, diff.z));
      if (axis == Axis.Y) return new Angle(Math.atan2(diff.x, diff.z));
      if (axis == Axis.Z) return new Angle(Math.atan2(diff.x, diff.y));
    }
  }

  // Comparative local rotation
  _localRotate(axis: Axis, angle: Angle) {
    if (axis == Axis.X) this.xRotation.add(angle);
    if (axis == Axis.Y) this.yRotation.add(angle);
    if (axis == Axis.Z) this.zRotation.add(angle);
    for (let r of this.targets) r.rotate(axis, angle, this.position);
  }

  // Absolute local rotation
  _setLocalRotation(axis: Axis, angle: Angle) {
    let diffAngle: Angle;
    if (axis == Axis.X) diffAngle = angle.difference(this.xRotation);
    if (axis == Axis.Y) diffAngle = angle.difference(this.yRotation);
    if (axis == Axis.Z) diffAngle = angle.difference(this.zRotation);
    this._localRotate(axis, diffAngle);
  }

  // Rotation about a pivot
  setRotation(axis: Axis, angle: Angle, pivot: Position = this.position): Rotation {
    this._setLocalRotation(axis, angle);
    if (!this.isLocalRotation(pivot)) {
      let radius = this.position.getDistance2D(axis, pivot);
      if (axis == Axis.X) {
        this.position.y = pivot.y + radius * Math.cos(angle.radians);
        this.position.z = pivot.z + radius * Math.sin(angle.radians);
      } else if (axis == Axis.Y) {
        this.position.x = pivot.x + radius * Math.cos(angle.radians);
        this.position.z = pivot.z + radius * Math.sin(angle.radians);
      } else if (axis == Axis.Z) {
        this.position.x = pivot.x + radius * Math.cos(angle.radians);
        this.position.y = pivot.y + radius * Math.sin(angle.radians);
      }
    }
    return this;
  }

  rotate(axis: Axis, angle: Angle, pivot: Position = this.position): Rotation {
    let currentAngle = this.getRotation(axis, pivot);
    this.setRotation(axis, currentAngle.add(angle), pivot);
    return this;
  }
}

/**
 * Display Component.
 */
class Display {

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
