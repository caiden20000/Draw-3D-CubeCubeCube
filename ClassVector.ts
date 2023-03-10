import { Point } from './ClassPoint';
import { Angle } from './ClassAngle';
import { PositionalObject } from './ClassPositionalObject';

export { Vector };

class Vector extends PositionalObject {
  constructor(x: number, y: number, z: number) {
    super(x, y, z);
  }

  // Returns independent copy of vector.
  copy(): Vector {
    return new Vector(this.x, this.y, this.z);
  }

  // Returns length (magnitude) of vector
  get magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  // Returns a normalized vector, ie. has a magnitude of 1
  normalized(): Vector {
    let n = new Vector(
      this.x / this.magnitude,
      this.y / this.magnitude,
      this.z / this.magnitude
    );
    return n;
  }

  // Modifies the object to become normalized
  normalize() {
    let norm = this.normalized();
    this.x = norm.x;
    this.y = norm.y;
    this.z = norm.z;
  }

  // Modifies this object
  // Adds all components
  add(vec: Vector) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
  }

  addNum(num: number) {
    this.add(new Vector(num, num, num));
  }

  // Modifies this object
  // Subtracts all vec components from this components
  subtract(vec: Vector) {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
  }

  subtractNum(num: number) {
    this.subtract(new Vector(num, num, num));
  }

  // Modifies this object
  // Multiplies all components
  multiply(vec: Vector) {
    this.x *= vec.x;
    this.y *= vec.y;
    this.z *= vec.z;
  }

  multiplyNum(num: number) {
    this.multiply(new Vector(num, num, num));
  }

  // Modifies this object
  // Divides all components in this by components in vec
  divide(vec: Vector) {
    this.x /= vec.x;
    this.y /= vec.y;
    this.z /= vec.z;
  }

  divideNum(num: number) {
    this.divide(new Vector(num, num, num));
  }

  invert() {
    this.multiplyNum(-1);
  }

  // The magnitude of the difference vector, OR
  // if (this) and (vec) are vectors from (0, 0),
  // returns the magnitude of the vector from (this) to (vec)
  distanceTo(vec: Vector): number {
    let dx = vec.x - this.x;
    let dy = vec.y - this.y;
    let dz = vec.z - this.z;
    return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
  }

  // Dot product, order independent
  // Returns zero if vectors are orthogonal (perpendicular)
  static dotProduct(vec1: Vector, vec2: Vector): number {
    return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
  }

  // Cross product, order _dependent_!
  // Returns a vector orthogonal to both input vectors
  // The magnitude of normal vector = the area of the parallelogram vec1 & vec2 outline
  static crossProduct(vec1: Vector, vec2: Vector): Vector {
    return new Vector(
      vec1.y * vec2.z - vec1.z * vec2.y,
      vec1.z * vec2.x - vec1.x * vec2.z,
      vec1.x * vec2.y - vec1.y * vec2.x
    );
  }

  // Angle between the two vectors, order independent
  // Returns an Angle object
  static angleBetween(vec1: Vector, vec2: Vector): Angle {
    let rad = Math.acos(
      Vector.dotProduct(vec1, vec2) / (vec1.magnitude * vec2.magnitude)
    );
    return new Angle(rad);
  }

  static fromPoints(p1: Point, p2: Point): Vector {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let dz = p2.z - p1.z;
    return new Vector(dx, dy, dz);
  }

  toPoint(): Point {
    return new Point(this.x, this.y, this.z);
  }

  static PositiveX = new Vector(1, 0, 0);
  static NegativeX = new Vector(-1, 0, 0);
  static PositiveY = new Vector(0, 1, 0);
  static NegativeY = new Vector(0, -1, 0);
  static PositiveZ = new Vector(0, 0, 1);
  static NegativeZ = new Vector(0, 0, -1);
}
