import { clamp } from './CommonTypes';
import { Vector } from './ClassVector';
import { Angle } from './ClassAngle';
export { Color };

class Color {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number = 1
  ) {}

  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  lightParallel(
    vec1: Vector,
    vec2: Vector,
    cycles: number = 1,
    darkness: Color = new Color(20, 20, 20)
  ) {
    let angle: Angle = Vector.angleBetween(vec1, vec2);
    let factor = -Math.cos(angle.radians * cycles);
    factor += 1;
    factor *= 0.5;
    let newCol = Color.Interpolate(this, darkness, factor);
    return newCol;
  }

  copy(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  clamp() {
    let newCol = this.copy();
    newCol.r = clamp(newCol.r, 0, 255);
    newCol.g = clamp(newCol.g, 0, 255);
    newCol.b = clamp(newCol.b, 0, 255);
    return newCol;
  }

  multiply(num: number) {
    let newCol = this.copy();
    newCol.r *= num;
    newCol.g *= num;
    newCol.b *= num;
    return newCol.clamp();
  }

  // Frac == 0 -> returns col1
  // Frac == 1 -> returns col2
  // Frac == 0.5 -> returns halfway between col1 and col2
  static Interpolate(col1: Color, col2: Color, frac: number): Color {
    let dCol = new Color(
      col2.r - col1.r,
      col2.g - col1.g,
      col2.b - col1.b,
      col2.a - col1.a
    );
    let middleColor = new Color(col1.r, col1.g, col1.b, col1.a);
    middleColor.r += dCol.r * frac;
    middleColor.g += dCol.g * frac;
    middleColor.b += dCol.b * frac;
    middleColor.a += dCol.a * frac;
    return middleColor;
  }

  static fromVector(vector: Vector, min: number, max: number) {
    let newColor = new Color(0, 0, 0, 1);
    newColor.r = clamp(vector.x, min, max);
    newColor.g = clamp(vector.y, min, max);
    newColor.b = clamp(vector.z, min, max);
    return newColor;
  }

  public static get RED() {
    return new Color(255, 0, 0);
  }
  public static get YELLOW() {
    return new Color(255, 255, 0);
  }
  public static get GREEN() {
    return new Color(0, 255, 0);
  }
  public static get CYAN() {
    return new Color(0, 255, 255);
  }
  public static get BLUE() {
    return new Color(0, 0, 255);
  }
  public static get PURPLE() {
    return new Color(255, 0, 255);
  }
  public static get WHITE() {
    return new Color(255, 255, 255);
  }
  public static get BLACK() {
    return new Color(0, 0, 0);
  }
  public static get GREY() {
    return new Color(127, 127, 127);
  }
  public static get TRANSPARENT() {
    return new Color(0, 0, 0, 0);
  }
}
