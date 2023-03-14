export { Quaternion };

class Quaternion {
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number
  ) {
    this.normalize();
  }

  normalize() {
    let magnitude = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    this.x /= magnitude;
    this.y /= magnitude;
    this.z /= magnitude;
  }

  add(quat: Quaternion): Quaternion {
    return this;
  }

  multiply(quat: Quaternion): Quaternion {
    return this;
  }
}
