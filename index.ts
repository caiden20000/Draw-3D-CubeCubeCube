// Import stylesheets
import './style.css';

// // // // // Imports // // // // //
// import {  } from "./Class";
import { r, r_li, clamp } from './CommonTypes';
import { Quad } from './ClassQuad';
import { Point } from './ClassPoint';
import { Shape } from './ClassShape';
import { Angle } from './ClassAngle';
import { Canvas } from './ClassCanvas';
import { Color } from './ClassColor';
import { RenderQueue } from './ClassRenderQueue';
import { Vector } from './ClassVector';
import { Axis } from './EnumAxis';
import { Square } from './ClassSquare';
import { Cube } from './ClassCube';
import { Frustum } from './ClassFrustum';
import { Renderable } from './ClassRenderable';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>Typescript template</h1>`;

// Below code created
// by C. Wiley
// 03/2023

// // // // // Splash Text // // // // //

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
appDiv.appendChild(canvasElement);

// // // // // Tools // // // // //

const ctx = canvasElement.getContext('2d');

// 6-sided shape with conjoined equilateral faces
// like, uh, a dice

// Test driving code //
let canvas = new Canvas(canvasElement, Angle.fromDegrees(45));
canvas.setBackgroundColor(new Color(0, 0, 0));

let q = new Square(new Point(75, 75, 300), 100);

// let cube = new Cube(new Point(-100, -150, 300), 100);
// cube.setColor(Color.BLUE());
// cube.updateColor();

var renderQueue = new RenderQueue();
var fps = 30;

let pressBuffer = {};
document.getElementsByTagName('html')[0].onkeydown = (e) => {
  pressBuffer[e.key] = true;
};
document.getElementsByTagName('html')[0].onkeyup = (e) => {
  pressBuffer[e.key] = null;
};
var walkSpeed = 10;
var turnSpeed = 5;

setInterval(() => {
  // Reset canvas for new frame
  canvas.clear();

  // run key functions

  // Draw quad
  q.setColor(Color.RED().lightParallel(Vector.PositiveY, q.getNormal(), 1));
  renderQueue.addRenderable(q);

  // Draw cube, shaded by how parallel normal is to vector
  // cube.lightNormal(new Vector(1, 2, -2), 0.9);
  // renderQueue.addShape(cube);

  //cube.drawNormals(renderQueue);

  // Renders all objects in a certain order

  if (pressBuffer['q'])
    renderQueue.rotateCamera(Axis.Y, Angle.fromDegrees(turnSpeed));
  if (pressBuffer['e'])
    renderQueue.rotateCamera(Axis.Y, Angle.fromDegrees(-turnSpeed));
  if (pressBuffer['d'])
    renderQueue.translateCamera(new Vector(walkSpeed, 0, 0));
  if (pressBuffer['a'])
    renderQueue.translateCamera(new Vector(-walkSpeed, 0, 0));
  if (pressBuffer['s'])
    renderQueue.translateCamera(new Vector(0, 0, -walkSpeed));
  if (pressBuffer['w'])
    renderQueue.translateCamera(new Vector(0, 0, walkSpeed));
  // Draw quad's normal vector (in default coloring)
  // Must draw after rotation/translation otherwise optical lagging occurs
  q.drawNormal(renderQueue);
  renderQueue.render(canvas);

  // Code that will modify the positon, rotation, scale, etc of objects:
  // cube.rotate(cube.center, Axis.Y, Angle.fromDegrees(5));

  q.rotate(q.getCenter(), Axis.X, Angle.fromDegrees(1));
  //q.rotate(new Point(75, 35, 200), Axis.X, Angle.fromDegrees(2));
  //q.rotate(new Point(100, 100, 150), Axis.Z, Angle.fromDegrees(5));
}, 1000 / fps);

// TODO: method to get rotation of a quad or shapee

// TODO: There needs to be a structure where all instantiated objects are added to a superArray,
//       and this can be used for "camera movement" as well as rendering.

// TODO: Uh oh, quaternions.
//       Basically, if we rotate everything in the scene to rotate the camera, then we have to have quaternion based rotation

// TODO: Coordinate pipeline
// Right now we have world space -> screen space
// Rotating all of the objects instead of rotating the camera is
// NOT sustainable, as something rotating on an axis will rotate on
// the new axis after rotation.
// SO we want a coordinate pipeline that goes
// WorldSpace -> CameraSpace -> ScreenSpace
// ie, all points in space are already stored in WorldSpace
// but now we add a CameraSpace layer where things are
// rotated and translated with respect to the camera.
// Maybe a new type of object can be used, called
// CameraSpaceObject
// that can encapsulate a Renderable
// and has the methods to calculate and store camera space.

// TODO new paradigm:
//      any method that modifies the object must return the object
//      for chaining purposes.
//      ie so we can do "return angle.rotate(x);"
//      instead of "angle.rotate(x); return angle;"
//    Right now its a mess, half of the methods do and half don't.

// TODO new paradigm:
//      NO get/set getters and setters.
//      only explicit method getSomething() and setSomething().

// TODO: replace Positional interface with this

// Renderable encapsulator
// keeps a reference to a Renderable object to
// calculate and store the camera space position.
// The storage is important for optimization.
// class CameraSpaceRenderable {
//   constructor(public object: Renderable, public camera: Camera) {}
// }

// class ScreenSpaceRenderable {
//   public frustum: Frustum;
//   constructor(public object: CameraSpaceRenderable, public canvas: Canvas) {
//     this.frustum = object.camera.frustum;
//   }
// }

/**
 * The structure of the rendering pipeline:
 * Points have x, y, z
 * Everything renderable has points
 * Points get converted into camera space via Camera
 * Points get converted from camera space to Screen space via Screen
 * points get drawn on screen
 */
