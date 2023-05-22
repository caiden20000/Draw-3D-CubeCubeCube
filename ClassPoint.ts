import { Vector } from './ClassVector';
import { Position, Rotation } from './Components';

export { Point };

class Point {
  static ORIGIN = () => new Point(0, 0, 0);
  public position: Position;
  public rotation: Rotation;
  constructor(x: number, y: number, z: number) {
    this.position = new Position(x, y, z);
    this.rotation = new Rotation(this.position);
  }

  equals(point: Point) {
    return this.position.equals(point.position);
  }

  toVector(): Vector {
    return new Vector(this.position.x, this.position.y, this.position.z);
  }
}
