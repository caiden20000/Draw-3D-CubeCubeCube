import { Point } from './ClassPoint';
import { Color } from './ClassColor';
import { Canvas } from './ClassCanvas';
import { Vector } from './ClassVector';
import { Angle } from './ClassAngle';
import { PositionalObject } from './ClassPositionalObject';

export { Drawable, Positional, Renderable, r, r_li, clamp, Axis };

interface Positional {
  translate(Vector);
  getPos(): Point;
  rotate(Point, Axis, Angle);
  //getRot(Axis): Angle; // TODO
}



type Renderable = Drawable & Positional;

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





// TODO
// I'm currently trying to combine PositionalObject + Drawable
// to make a RenderableObject abstract superclass
// I'm also refactoring the code to draw things with a Drawable extending class that encapsulates Points and Vectors, and the Quad class will extend Drawable
