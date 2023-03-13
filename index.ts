// Import stylesheets
import './style.css';

// // // // // Imports // // // // //
// import {  } from "./Class";
import { r, r_li, clamp } from './CommonTypes';
import { Angle } from './ClassAngle';
import { Canvas } from './ClassCanvas';
import { Color } from './ClassColor';
import { RenderQueue } from './ClassRenderQueue';
import { Vector } from './ClassVector';
import { Axis } from './EnumAxis';
import { Square } from './ClassSquare';
import { Cube } from './ClassCube';
import { Camera } from './ClassCamera';
import { DrawableVector } from './ClassDrawableVector';
import { Position } from './Components';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>Typescript template</h1>`;

// Below code created
// by C. Wiley
// 03/2023

// // // // // Splash Text // // // // //

let splashText: string[] = [
  'Makes cookies!',
  '!! TYPE FASTER !!',
  'Let CUBE comsume you',
  'Fill it with words!',
  'Release date: never!',
  'if you stop now, you might never come back!',
  'Minceraft!',
  'Stinky fingers!',
  'Weak bones',
  'Kneads the dough!',
  'NEEDS THE DOUGH!',
  'MONTE!!',
  "Coding challenge: Don't!",
  'no u',
  'umadbro?',
  'Rails: off',
  'Jimmies: rustled',
  'Warning: can be easily spooked',
  'BOO!',
  '☺♥☻',
  'ᕕ( ՞ ᗜ ՞ )ᕗ',
  'ᕕ(⌐■_■)ᕗ ♪♬',
  '(-_-｡)',
  'INTENTIONALLY LEFT BLANK',
  '!! SPIN FASTER !!',
  'Direct Access!',
  "it's_a_snake!",
  "it'sACamel!",
  'Runs quiet!',
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
let canvas = new Canvas(canvasElement);
canvas.setBackgroundColor(new Color(0, 0, 0));
let camera = new Camera(canvas, Angle.fromDegrees(45));

let q = new Square(75, 75, 300, 100);

let cube = new Cube(-100, -150, 300, 100);
cube.style.setColor(Color.BLUE);
cube.updateColor();

var renderQueue = new RenderQueue();
var fps = 30; // todo changie after fixie

let pressBuffer = {};
document.getElementsByTagName('html')[0].onkeydown = (e) => {
  pressBuffer[e.key] = true;
};
document.getElementsByTagName('html')[0].onkeyup = (e) => {
  pressBuffer[e.key] = null;
};
var walkSpeed = 10;
var turnSpeed = 5;

var interval;
var stepThrough = false;
if (stepThrough) {
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.key == ' ') frame();
  };
} else {
  interval = setInterval(() => frame(), 1000 / fps);
}
let step = 0;
let cubeV = { x: 10, y: 9, z: 8 };
var frame = () => {
  // Reset canvas for new frame
  camera.canvas.clear();

  // run key functions

  // Draw quad
  // q.style.setColor(Color.RED.lightParallel(Vector.PositiveY, q.getNormal(), 1));
  // renderQueue.addStageable(q);

  // Draw cube, shaded by how parallel normal is to vector
  cube.lightNormal(new Vector(1, 2, -2), 0.9);
  renderQueue.addStageable(cube);

  // renderQueue.addStageable(DrawableVector.asNormal(q));
  // for (let p of cube.polys)
  //   renderQueue.addStageable(DrawableVector.asNormal(p));

  // Renders all objects in a certain order
  renderQueue.stage();

  if (pressBuffer['q'])
    camera.rotation.rotate(Axis.Y, Angle.fromDegrees(turnSpeed));
  if (pressBuffer['e'])
    camera.rotation.rotate(Axis.Y, Angle.fromDegrees(-turnSpeed));
  if (pressBuffer['d']) camera.position.translate(walkSpeed, 0, 0);
  if (pressBuffer['a']) camera.position.translate(-walkSpeed, 0, 0);
  if (pressBuffer['s']) camera.position.translate(0, 0, -walkSpeed);
  if (pressBuffer['w']) camera.position.translate(0, 0, walkSpeed);
  if (pressBuffer['p']) clearInterval(interval);
  // Draw quad's normal vector (in default coloring)
  // Must draw after rotation/translation otherwise optical lagging occurs
  // q.drawNormal(renderQueue);
  renderQueue.render(camera);

  // Code that will modify the positon, rotation, scale, etc of objects:
  //console.log(q.points[0].position.z);
  q.rotation.rotate(Axis.X, Angle.fromDegrees(10), new Position(75, 75, 250));
  cube.rotation.rotate(Axis.Y, Angle.fromDegrees(5));
  cube.rotation.rotate(Axis.Z, Angle.fromDegrees(3));

  // cube.position.translate(cubeV.x, cubeV.y, cubeV.z);
  // if (cubeV.x > 0 && cube.position.x >= canvasWidth/2) cubeV.x *= -1;
  // if (cubeV.x < 0 && cube.position.x <= -canvasWidth/2) cubeV.x *= -1;
  // if (cubeV.y > 0 && cube.position.y >= canvasHeight/2) cubeV.y *= -1;
  // if (cubeV.y < 0 && cube.position.y <= -canvasHeight/2) cubeV.y *= -1;
  // if (cubeV.z > 0 && cube.position.z >= 450) cubeV.z *= -1;
  // if (cubeV.z < 0 && cube.position.z <= 150) cubeV.z *= -1;
};

/*
Current model:
"Stageable" objects have the method stage(Renderable[]).
You add stageable objects to the rendering queue via renderQueue.addStageable().
When renderingQueue.stage() is called, it calls stage(renderQueue[]) on every stageable.
Each stageable object will then add Renderable object/s to the array passed in.
For example, Polys stage themselves.
             Shapes stage every poly they contain.
             DrawableVectors stage themselves and their DrawablePoint tip.
Renderable objects contain a Position, Rotation, and draw(Camera).
When renderQueue.render(Camera) is called, it calls draw(Camera) on every renderable
(in order of descending distance from camera center)
*/

/*
TODO:
Fix/remove remnants of old PositionalObject and Renderable system
Add camera dependent position conversion API
Implement it
Implement size component for Poly, Shape (base on ratio of distance to points)
*/
