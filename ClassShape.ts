import { Colorable, Drawable, Positional, Axis } from './CommonTypes';
import { Point } from './ClassPoint';
import { Vector } from './ClassVector';
import { Angle } from './ClassAngle';
import { Canvas } from './ClassCanvas';
import { Quad } from './ClassQuad';
import { Color } from './ClassColor';
import { RenderQueue } from './ClassRenderQueue';

export { Shape };

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
