export { Angle };

class Angle {
  // Internal property "value" is ALWAYS in radians.
  static fromRadians = (r: number) => new Angle(r);
  static fromDegrees = (d: number) => new Angle(this.degreesToRadians(d));
  constructor(public value: number) {}

  static Deg0 = () => Angle.fromDegrees(0);
  static Deg90 = () => Angle.fromDegrees(90);
  static Deg180 = () => Angle.fromDegrees(180);
  static Deg270 = () => Angle.fromDegrees(270);

  get radians() {
    return this.value;
  }

  set radians(radians: number) {
    this.value = radians;
  }

  get degrees() {
    return Angle.radiansToDegrees(this.value);
  }

  set degrees(degrees: number) {
    this.value = Angle.degreesToRadians(degrees);
  }

  sum(angle: Angle) {
    return new Angle(this.radians + angle.radians);
  }

  difference(angle: Angle) {
    return new Angle(this.radians - angle.radians);
  }

  multiply(x: number) {
    this.value *= x;
    return this;
  }

  invert(): Angle {
    this.multiply(-1);
    return this;
  }

  add(angle: Angle): Angle {
    this.value += angle.value;
    return this;
  }

  addRadians(radians: number) {
    this.value += radians;
    return this;
  }

  addDegrees(degrees: number) {
    this.value += Angle.degreesToRadians(degrees);
    return this;
  }

  // Modifies this object
  // Brings into the range [0, 2pi)
  normalize() {
    // Note: -x % y == -(x % y)
    this.value %= 2 * Math.PI;
    if (this.value < 0) this.value += 2 * Math.PI;
  }

  // Modifies this object
  // Brings into the range [-pi, pi)
  // or [-180 deg, 180 deg)
  center() {
    this.normalize();
    this.value -= Math.PI;
  }

  get cos() {
    return Math.cos(this.radians);
  }

  get sin() {
    return Math.sin(this.radians);
  }

  static radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
