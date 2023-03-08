// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>Typescript template</h1>`;

// Below code created
// by C. Wiley
// 03/2023

// // // // // Splash Text // // // // //

// Returns random int in range [min, max] inclusive
function r(min: number, max: number): number {
  return Math.round(Math.random() * (max - min)) + min;
}

// Returns random element from the list
function r_li<T>(list: T[]): T {
  return list[r(0, list.length - 1)];
}

function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

let splashText: string[] = [
  'Makes the cookies!',
  'TYPE FASTER',
  'Do it, let CUBE comsume you',
  'fill it with words',
  'release date: never',
  'if you stop now, you may never come back',
  'I need serious help. With coding.',
  'Minceraft!',
  'is a brank, pro',
  'stinky fingers',
  "This isn't that.",
  'inaproprit comnent',
  'Weak bones',
  'Kneads the dough!',
  'NEEDS THE DOUGH',
  'MONTE!!',
  'coding challenge: dont',
  'no u',
  'umadbro?',
  'rails: off',
  'jimmies: rustled',
  'can be easily spooked',
  'boo',
  '☺♥☻',
  'ᕕ( ՞ ᗜ ՞ )ᕗ',
  'ᕕ(⌐■_■)ᕗ ♪♬',
  '(-_-｡)',
  'INTENTIONALLY LEFT BLANK',
  'LGBTQIA++ is not a coding language',
  'SPIN FASTER',
  'Direct Access',
];

appDiv.innerHTML = `<h1>${r_li<string>(splashText)}</h1>`;

// // // // // Canvas // // // // //
const canvasWidth = 400;
const canvasHeight = 400;

let canvasElement: HTMLCanvasElement = document.createElement('canvas');
canvasElement.id = 'canvas';
canvasElement.width = canvasWidth;
canvasElement.height = canvasHeight;
//appDiv.appendChild(new HTMLBRElement());
appDiv.appendChild(canvasElement);

// // // // // Tools // // // // //

const ctx = canvasElement.getContext('2d');

enum Axis {
  X,
  Y,
  Z,
}

interface Drawable {
  draw(canvas: Canvas): void;
}

interface Positional {
  translate(Vector);
  getPos(): Point;
  rotate(Point, Axis, Angle);
  //getRot(Axis): Angle; // TODO
}

type Renderable = Drawable & Positional;

// TODO: The color in drawable is a bad idea
// Make a superclass _colored_ or something
// include stroke and fill colors
// then have a shared setColor(canvas) method

class Colorable {
  public fillColor: Color;
  public strokeColor: Color;
  constructor() {
    this.fillColor = Color.PURPLE();
    this.strokeColor = Color.GREEN();
  }

  applyColor(canvas: Canvas) {
    canvas.setColor(this.fillColor, this.strokeColor);
  }

  set color(color: Color) {
    this.fillColor = color;
    this.strokeColor = color;
  }
}

// Point in 3D space
// Basically a vector but without the utilities
// Still useful to define a type difference
class Point extends Colorable implements Drawable, Positional {
  static ORIGIN = () => new Point(0, 0, 0);
  constructor(public x: number, public y: number, public z: number) {
    super();
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

  public drawSize = 6;
  draw(canvas: Canvas) {
    let proj = canvas.screen.projectPoint(this);
    this.applyColor(canvas);
    canvas.ctx.fillRect(
      proj.x - this.drawSize / 2,
      proj.y - this.drawSize / 2,
      this.drawSize,
      this.drawSize
    );
  }

  getPos(): Point {
    return this;
  }
}

// Vector in 3D space
class Vector {
  constructor(public x: number, public y: number, public z: number) {}

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

  translate(vec: Vector) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
  }

  rotate(point: Point, axis: Axis, angle: Angle) {
    let rotated = this.toPoint();
    rotated.rotate(point, axis, angle);
    this.x = rotated.x;
    this.y = rotated.y;
    this.z = rotated.z;
  }

  static PositiveX = new Vector(1, 0, 0);
  static NegativeX = new Vector(-1, 0, 0);
  static PositiveY = new Vector(0, 1, 0);
  static NegativeY = new Vector(0, -1, 0);
  static PositiveZ = new Vector(0, 0, 1);
  static NegativeZ = new Vector(0, 0, -1);
}

class DrawableVector extends Colorable implements Drawable, Positional {
  constructor(
    public vector: Vector,
    public origin: Point,
    public length: number = 50
  ) {
    super();
    this.vector.normalize();
    this.vector.multiplyNum(length);
    this.vector.add(origin.toVector());
  }

  draw(canvas: Canvas) {
    let vec = this.vector.copy(); // Don't want to modify the original vector
    let projectedOrigin = canvas.screen.projectPoint(this.origin);
    let projectedVector = canvas.screen.projectPoint(vec.toPoint());
    this.applyColor(canvas);
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(projectedOrigin.x, projectedOrigin.y);
    canvas.ctx.lineTo(projectedVector.x, projectedVector.y);
    canvas.ctx.closePath();
    canvas.ctx.stroke();

    //let endPoint = vec.toPoint();
    //endPoint.drawSize = 10 / (vec.z / 100);
    //endPoint.draw(canvas);
  }

  translate(vec: Vector) {
    this.vector.translate(vec);
  }

  getPos() {
    let avg = new Point(0, 0, 0);
    avg.x = (this.origin.x + this.vector.x) / 2;
    avg.y = (this.origin.y + this.vector.y) / 2;
    avg.z = (this.origin.z + this.vector.z) / 2;
    //console.log(this.origin.z + ", " + avg.z);
    return avg;
  }

  rotate(point: Point, axis: Axis, angle: Angle) {
    this.vector.rotate(point, axis, angle);
  }
}

// Consolodate degrees, radians
// Stores in radians by default.
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
  }

  invert(): Angle {
    this.multiply(-1);
    return this;
  }

  addRadians(radians: number) {
    this.value += radians;
  }

  addDegrees(degrees: number) {
    this.value += Angle.degreesToRadians(degrees);
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

// Origin is at center of frustum
// alpha is X fov, beta is Y fov
class Frustum {
  public xDom: number;
  public yDom: number;
  constructor(
    public width: number = canvasWidth,
    public height: number = canvasHeight,
    public alpha: Angle = Angle.fromDegrees(45),
    public beta: Angle = Angle.fromDegrees(45)
  ) {
    this.xDom = width / 2;
    this.yDom = height / 2;
  }

  // Returns a vector pointing to the corner fo the first quadrant of
  // the finite plane bounded by the frustum angled planes
  // ie. the X and Y components are 1/2 width and height of face at that Z value
  getDomAtZ(z: number): Vector {
    if (z < 0) return new Vector(0, 0, z);
    let dx =
      (z * Math.sin(this.alpha.radians)) /
      Math.sin(Angle.Deg90().difference(this.alpha).radians);
    let dy =
      (z * Math.sin(this.beta.radians)) /
      Math.sin(Angle.Deg90().difference(this.beta).radians);
    //console.log(dx);
    if (isNaN(dx) || !isFinite(dx)) dx = 0;
    if (isNaN(dy) || !isFinite(dy)) dy = 0;
    return new Vector(this.xDom + dx, this.yDom + dy, z);
  }

  projectPoint(p: Point): Point {
    let pDom = this.getDomAtZ(p.z);
    //console.log(pDom);
    // Normalize point position with (p.x / pDom.x), then project by multiplying this.xDom
    let projected = new Point(
      (p.x * this.xDom) / pDom.x,
      (p.y * this.yDom) / pDom.y,
      0
    );
    return projected;
  }

  projectQuad(quad: Quad): Quad {
    let proj1 = this.projectPoint(quad.p1);
    let proj2 = this.projectPoint(quad.p2);
    let proj3 = this.projectPoint(quad.p3);
    let proj4 = this.projectPoint(quad.p4);
    let projQuad = new Quad(proj1, proj2, proj3, proj4);
    return projQuad;
  }

  isPointInFrustum(p: Point): boolean {
    if (p.z < 0) return false;
    let pDom = this.getDomAtZ(p.z);
    if (Math.abs(p.x) <= pDom.x && Math.abs(p.y) <= pDom.y) return true;
    return false;
  }

  // Returns true if 1 or more points of quad is in frustum
  isQuadInFrustum(quad: Quad): boolean {
    for (let p of quad.points) {
      if (this.isPointInFrustum(p)) return true;
    }
    return false;
  }
}

// Collection of 4 points drawn as a face
// Try to keep them all on one plane, please!
class Quad extends Colorable implements Drawable, Positional {
  constructor(
    public p1: Point,
    public p2: Point,
    public p3: Point,
    public p4: Point
  ) {
    super();
  }

  get points(): Point[] {
    return [this.p1, this.p2, this.p3, this.p4];
  }

  // cube rotating faster than Square by like x3, but this is called ONCE for each quad in the scene. Issue may be in p.rotate()
  rotate(pivot: Point, axis: Axis, angle: Angle) {
    for (let p of this.points) p.rotate(pivot, axis, angle);
  }

  translate(vec: Vector) {
    for (let p of this.points) p.translate(vec);
  }

  floor() {
    for (let p of this.points) p.floor();
  }

  get center(): Point {
    let avg = new Point(0, 0, 0);
    for (let p of this.points) {
      avg.x += p.x;
      avg.y += p.y;
      avg.z += p.z;
    }
    let numberOfPoints = this.points.length;
    avg.x /= numberOfPoints;
    avg.y /= numberOfPoints;
    avg.z /= numberOfPoints;
    return avg;
  }

  // Generates normal vector assuming all 4 points are on a plane
  get normal(): Vector {
    let v1 = Vector.fromPoints(this.p1, this.p2);
    let v2 = Vector.fromPoints(this.p1, this.p4);
    let n = Vector.crossProduct(v1, v2);
    n.invert();
    return n;
  }

  draw(canvas: Canvas) {
    let projQuad = canvas.screen.projectQuad(this);
    //projQuad.floor();
    this.applyColor(canvas);
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(projQuad.p1.x, projQuad.p1.y);
    canvas.ctx.lineTo(projQuad.p2.x, projQuad.p2.y);
    canvas.ctx.lineTo(projQuad.p3.x, projQuad.p3.y);
    canvas.ctx.lineTo(projQuad.p4.x, projQuad.p4.y);
    canvas.ctx.closePath();
    canvas.ctx.fill();
    canvas.ctx.stroke();
  }

  getPos(): Point {
    return this.center;
  }

  drawNormal(renderQueue: RenderQueue) {
    renderQueue.addRenderable(new DrawableVector(this.normal, this.center));
  }
}

// I guess, implicitly implements Drawable, Positional VIA extending Quad
class Square extends Quad {
  constructor(public centerPoint: Point, public size: number) {
    let hs = size / 2;
    let pp = new Point(hs, hs, 0);
    let pn = new Point(hs, -hs, 0);
    let np = new Point(-hs, hs, 0);
    let nn = new Point(-hs, -hs, 0);
    super(pp, np, nn, pn);
    this.translate(centerPoint.toVector());
  }
}

// Various color utilities
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

  static RED = () => new Color(255, 0, 0);
  static YELLOW = () => new Color(255, 255, 0);
  static GREEN = () => new Color(0, 255, 0);
  static CYAN = () => new Color(0, 255, 255);
  static BLUE = () => new Color(0, 0, 255);
  static PURPLE = () => new Color(255, 0, 255);
  static WHITE = () => new Color(255, 255, 255);
  static BLACK = () => new Color(0, 0, 0);
  static GREY = () => new Color(127, 127, 127);
  static TRANSPARENT = () => new Color(0, 0, 0, 0);
}

// Collection of quads
class Shape extends Colorable implements Drawable, Positional {
  public quads: Quad[];
  constructor() {
    super();
    this.quads = [];
  }

  addQuad(quad: Quad) {
    this.quads.push(quad);
  }

  get center(): Point {
    let avg = new Point(0, 0, 0);
    for (let quad of this.quads) {
      let quadCenter = quad.center;
      avg.x += quadCenter.x;
      avg.y += quadCenter.y;
      avg.z += quadCenter.z;
    }
    let quadCount = this.quads.length;
    avg.x /= quadCount;
    avg.y /= quadCount;
    avg.z /= quadCount;
    return avg;
  }

  rotate(pivot: Point, axis: Axis, angle: Angle) {
    for (let quad of this.quads) quad.rotate(pivot, axis, angle);
  }

  translate(vec: Vector) {
    for (let quad of this.quads) quad.translate(vec);
  }

  updateColor() {
    for (let quad of this.quads) {
      quad.fillColor = this.fillColor;
      quad.strokeColor = this.strokeColor;
    }
  }

  // Lights each quad based on how aligned the quad is with the input vector
  // ie,  quad.normal parallel to vector == this.fillColor
  //      quad.normal orthogonal to vector == darkness color
  lightNormal(
    vector: Vector,
    intensity: number = 1,
    darkness: Color = new Color(20, 20, 20)
  ) {
    let litColor = this.fillColor.copy();
    litColor = litColor.multiply(intensity);
    for (let quad of this.quads) {
      quad.color = litColor.lightParallel(quad.normal, vector, 1, darkness);
    }
  }

  draw(canvas: Canvas) {
    for (let quad of this.quads) quad.draw(canvas);
  }

  getPos(): Point {
    return this.center;
  }

  drawNormals(renderQueue: RenderQueue) {
    for (let q of this.quads) {
      q.drawNormal(renderQueue);
    }
  }
}

// 6-sided shape with conjoined equilateral faces
// like, uh, a dice
class Cube extends Shape {
  constructor(public centerPosition: Point, public size: number) {
    super();
    this.init();
  }

  init() {
    let preRot: Angle = null;
    if (this.quads.length > 0) {
      this.centerPosition = this.center;
    }
    this.quads = [];
    let hs = this.size / 2;
    /* 
    // xyz, p = positive, n = negative
    let ppp = new Point(hs, hs, hs);
    let ppn = new Point(hs, hs, -hs);
    let pnp = new Point(hs, -hs, hs);
    let pnn = new Point(hs, -hs, -hs);
    let npp = new Point(-hs, hs, hs);
    let npn = new Point(-hs, hs, -hs);
    let nnp = new Point(-hs, -hs, hs);
    let nnn = new Point(-hs, -hs, -hs);
    // Front
    this.addQuad(new Quad(ppn, npn, nnn, pnn));
    // Back
    this.addQuad(new Quad(ppp, pnp, nnp, npp));
    // Left
    this.addQuad(new Quad(npn, npp, nnp, nnn));
    // Right
    this.addQuad(new Quad(ppn, pnn, pnp, ppp));
    // Top
    this.addQuad(new Quad(ppp, npp, npn, ppn));
    // Bottom
    this.addQuad(new Quad(pnp, pnn, nnn, nnp));
    */
    // Old, easy system caused quads to share point references, which messed up certain translations,
    // eg, made it rotate ~3x faster because every point was rotated 3 times.
    // Front
    this.addQuad(
      new Quad(
        new Point(hs, hs, -hs),
        new Point(-hs, hs, -hs),
        new Point(-hs, -hs, -hs),
        new Point(hs, -hs, -hs)
      )
    );
    // Back
    this.addQuad(
      new Quad(
        new Point(hs, hs, hs),
        new Point(hs, -hs, hs),
        new Point(-hs, -hs, hs),
        new Point(-hs, hs, hs)
      )
    );
    // Left
    this.addQuad(
      new Quad(
        new Point(-hs, hs, -hs),
        new Point(-hs, hs, hs),
        new Point(-hs, -hs, hs),
        new Point(-hs, -hs, -hs)
      )
    );
    // Right
    this.addQuad(
      new Quad(
        new Point(hs, hs, -hs),
        new Point(hs, -hs, -hs),
        new Point(hs, -hs, hs),
        new Point(hs, hs, hs)
      )
    );
    // Top
    this.addQuad(
      new Quad(
        new Point(hs, hs, hs),
        new Point(-hs, hs, hs),
        new Point(-hs, hs, -hs),
        new Point(hs, hs, -hs)
      )
    );
    // Bottom
    this.addQuad(
      new Quad(
        new Point(hs, -hs, hs),
        new Point(hs, -hs, -hs),
        new Point(-hs, -hs, -hs),
        new Point(-hs, -hs, hs)
      )
    );

    this.translate(this.centerPosition.toVector());
  }
}

// Canvas object for drawing
class Canvas {
  public ctx: CanvasRenderingContext2D;
  public screen: Frustum;
  public backgroundColor: Color = new Color(0, 0, 0);
  public width;
  public height;
  constructor(
    public canvasElement: HTMLCanvasElement,
    public fov: Angle = Angle.fromDegrees(90)
  ) {
    this.width = canvasElement.width;
    this.height = canvasElement.height;
    this.screen = new Frustum(this.width, this.height, fov, fov);
    this.ctx = canvasElement.getContext('2d');
    // Set origin in center
    this.ctx.translate(this.screen.xDom, this.screen.yDom);
    // Also make positive y go up
    this.ctx.scale(1, -1);
  }

  clear() {
    this.ctx.clearRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    this.drawBackgroundColor();
  }

  setColor(fill: Color, stroke: Color = fill) {
    this.ctx.fillStyle = fill.toString();
    this.ctx.strokeStyle = stroke.toString();
  }

  setBackgroundColor(color: Color) {
    this.backgroundColor = color;
    this.drawBackgroundColor();
  }

  drawBackgroundColor() {
    this.setColor(this.backgroundColor);
    this.ctx.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
  }

  drawArrowHead(point: Point, vec: Vector, size: number) {
    this.ctx.beginPath();
  }
}

class RenderQueue {
  public renderQueue: Renderable[];
  public shapeList: Shape[];
  public simpleList: Positional[];
  constructor() {
    this.renderQueue = [];
    this.shapeList = [];
    this.simpleList = [];
  }

  // Call this after everything is added
  rotateCamera(axis: Axis, angle: Angle) {
    let compoundList = this.simpleList.concat(this.shapeList);
    angle.invert();
    for (let p of compoundList) p.rotate(Point.ORIGIN(), axis, angle);
    // TODO: Why is Cube rotating three times as fast as Square?
  }

  translateCamera(vec: Vector) {
    let compoundList = this.simpleList.concat(this.shapeList);
    vec.invert();
    for (let p of compoundList) p.translate(vec);
  }

  // Breaks shapes into quads
  addShape(shape: Shape) {
    this.shapeList.push(shape);
    for (let q of shape.quads) this.renderQueue.push(q);
  }

  addRenderable(r: Renderable) {
    this.simpleList.push(r);
    this.renderQueue.push(r);
  }

  // Adds quads and points to renderQueue in order of descending Z
  readyRenderQueue() {
    //this.sortQueueByZ();
    this.sortQueueByDistanceToOrigin();
  }

  sortQueueByZ() {
    // Hopefully sorts descending Z
    this.renderQueue.sort((a, b) => b.getPos().z - a.getPos().z);
  }

  sortQueueByDistanceToOrigin() {
    this.renderQueue.sort(
      (a, b) =>
        b.getPos().distanceTo(Point.ORIGIN()) -
        a.getPos().distanceTo(Point.ORIGIN())
    );
  }

  clearRenderQueue() {
    this.renderQueue = [];
    this.shapeList = [];
    this.simpleList = [];
  }

  // Draws all Drawable in renderQueue in order
  // Clears the renderQueue, add things every frame!
  render(canvas: Canvas) {
    this.readyRenderQueue();
    for (let r of this.renderQueue) r.draw(canvas);
    this.clearRenderQueue();
  }
}

// Interaction code //
// This whole schtick is too extra
class InteractiveLayer {
  public leftKeyFunc: () => void;
  public leftKeySymbol = 'a';
  public rightKeyFunc: () => void;
  public rightKeySymbol = 'd';
  public upKeyFunc: () => void;
  public upKeySymbol = 'w';
  public downKeyFunc: () => void;
  public downKeySymbol = 's';
  public clickFunc: (e: MouseEvent) => void;
  public mouseMoveFunc: (e: MouseEvent) => void;
  public pressBuffer = {};
  constructor(public element: HTMLElement) {
    this.element.onkeydown = (e: KeyboardEvent) => {
      this.pressBuffer[e.key] = true;
    };

    this.element.onkeyup = (e: KeyboardEvent) => {
      this.pressBuffer[e.key] = null;
    };

    this.leftKeyFunc = () => {};
    this.rightKeyFunc = () => {};
    this.upKeyFunc = () => {};
    this.downKeyFunc = () => {};
    this.clickFunc = () => {};
    this.mouseMoveFunc = () => {};
  }

  // all-important, call every frame
  checkLayer() {
    if (this.pressBuffer[this.leftKeySymbol]) this.leftKeyFunc();
    if (this.pressBuffer[this.rightKeySymbol]) this.rightKeyFunc();
    if (this.pressBuffer[this.upKeySymbol]) this.upKeyFunc();
    if (this.pressBuffer[this.downKeySymbol]) this.downKeyFunc();
  }

  set click(newFunc: (e: MouseEvent) => void) {
    this.element.onclick = newFunc;
  }

  set mouseMove(newFunc: (e: MouseEvent) => void) {
    this.element.onmousemove = newFunc;
  }
}
var interactiveLayer = new InteractiveLayer(
  document.getElementsByTagName('html')[0]
);

// Test driving code //
let canvas = new Canvas(canvasElement, Angle.fromDegrees(45));
canvas.setBackgroundColor(new Color(0, 0, 0));

let q = new Square(new Point(75, 75, 300), 100);

let cube = new Cube(new Point(-100, -150, 300), 100);
cube.color = Color.BLUE();
cube.updateColor();

/* // This whole schtick is too extra
interactiveLayer.leftKeyFunc = () => {cube.translate(new Vector(-speed, 0, 0))};
interactiveLayer.rightKeyFunc = () => {cube.translate(new Vector(speed, 0, 0))};
interactiveLayer.upKeyFunc = () => {cube.translate(new Vector(0, speed, 0))};
interactiveLayer.downKeyFunc = () => {cube.translate(new Vector(0, -speed, 0))};
*/

var renderQueue = new RenderQueue();
var fps = 30;

let pressBuffer = {};
document.getElementsByTagName('html')[0].onkeydown = (e) => {
  pressBuffer[e.key] = true;
};
document.getElementsByTagName('html')[0].onkeyup = (e) => {
  pressBuffer[e.key] = null;
};
let speed = 5;

setInterval(() => {
  // Reset canvas for new frame
  canvas.clear();

  // run key functions

  // Draw quad
  q.color = Color.RED().lightParallel(Vector.PositiveY, q.normal, 1);
  renderQueue.addRenderable(q);


  // Draw cube, shaded by how parallel normal is to vector
  cube.lightNormal(new Vector(1, 2, -2), 0.9);
  renderQueue.addShape(cube);

  //cube.drawNormals(renderQueue);

  // Renders all objects in a certain order

  if (pressBuffer['q']) renderQueue.rotateCamera(Axis.Y, Angle.fromDegrees(speed));
  if (pressBuffer['e']) renderQueue.rotateCamera(Axis.Y, Angle.fromDegrees(-speed));
  if (pressBuffer['d']) renderQueue.translateCamera(new Vector(speed, 0, 0));
  if (pressBuffer['a']) renderQueue.translateCamera(new Vector(-speed, 0, 0));
  if (pressBuffer['s']) renderQueue.translateCamera(new Vector(0, 0, -speed));
  if (pressBuffer['w']) renderQueue.translateCamera(new Vector(0, 0, speed));
  // Draw quad's normal vector (in default coloring)
  // Must draw after rotation/translation otherwise optical lagging occurs
  q.drawNormal(renderQueue);
  renderQueue.render(canvas);

  // Code that will modify the positon, rotation, scale, etc of objects:
  //cube.rotate(cube.center, Axis.Y, Angle.fromDegrees(1));

  //q.rotate(q.center, Axis.X, Angle.fromDegrees(5));
  //q.rotate(new Point(75, 35, 200), Axis.X, Angle.fromDegrees(2));
  //q.rotate(new Point(100, 100, 150), Axis.Z, Angle.fromDegrees(5));
}, 1000 / fps);

// TODO: method to get rotation of a quad or shapee
