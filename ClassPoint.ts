import { PositionalObject } from './ClassPositionalObject';
import { Vector } from './ClassVector';

export { Point };

class Point extends PositionalObject {
  static ORIGIN = () => new Point(0, 0, 0);
  constructor(x: number, y: number, z: number) {
    super(x, y, z);
  }

  copy(): Point {
    return new Point(this.x, this.y, this.z);
  }

  distanceTo(point: Point): number {
    let dx = point.x - this.x;
    let dy = point.y - this.y;
    let dz = point.z - this.z;
    return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
  }

  getDiff(point: Point): Point {
    let diff = new Point(0, 0, 0);
    diff.x = point.x - this.x;
    diff.y = point.y - this.y;
    diff.z = point.z - this.z;
    return diff;
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
  }

  equals(point: Point) {
    return this.x == point.x && this.y == point.y && this.z == point.z;
  }

  toVector(): Vector {
    return new Vector(this.x, this.y, this.z);
  }
}
