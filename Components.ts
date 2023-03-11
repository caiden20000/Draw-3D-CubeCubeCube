import { Angle } from './ClassAngle';
import { Canvas } from './ClassCanvas';
import { Color } from './ClassColor';
import { Point } from './ClassPoint';
import { Vector } from './ClassVector';
import { Axis } from './EnumAxis';

export { Position, Size, Rotation, Style };

/**
 * Position Component.
 */
class Position {
  static get ORIGIN() {
    return new Position(0, 0, 0);
  }
  constructor(public x: number, public y: number, public z: number) {}
  static fromPoints(points: Point[]): Position {
    let avg = new Position(0, 0, 0);
    for (let p of points) {
      avg.x += p.position.x;
      avg.y += p.position.y;
      avg.z += p.position.z;
    }
    avg.x /= points.length;
    avg.y /= points.length;
    avg.z /= points.length;
    return avg;
  }

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

  translateByVector(vec: Vector) {
    return this.translate(vec.x, vec.y, vec.z);
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
    return Math.sqrt(diff.x ** 2 + diff.y ** 2 + diff.z ** 2);
  }

  /**
   * Returns the distance in 2D on the plane orthogonal to the given axis
   */
  getDistance2D(axis: Axis, pos: Position): number {
    let diff = this.getDifference(pos);
    if (axis == Axis.X) return Math.sqrt(diff.y ** 2 + diff.z ** 2);
    if (axis == Axis.Y) return Math.sqrt(diff.x ** 2 + diff.z ** 2);
    if (axis == Axis.Z) return Math.sqrt(diff.x ** 2 + diff.y ** 2);
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
  constructor(public value: number) {
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
  public xRotation: Angle = new Angle(0);
  public yRotation: Angle = new Angle(0);
  public zRotation: Angle = new Angle(0);
  // "targets" are any additional objects you want to rotate along with this.
  constructor(public position: Position, public targets: Rotation[] = []) {}

  static getRotationArrayFromPoints(points: Point[]): Rotation[] {
    let result: Rotation[] = [];
    for (let p of points) result.push(p.rotation);
    return result;
  }
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
  setRotation(
    axis: Axis,
    angle: Angle,
    pivot: Position = this.position
  ): Rotation {
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
class Display {}

/**
 * Style component.
 * Holds the fill and stroke colors.
 * Call applyColor(canvas) to load the colors up before drawing.
 */
class Style {
  constructor(public fillColor: Color, public strokeColor: Color = fillColor) {}

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
}
