import { Point } from './ClassPoint';
import { Vector } from './ClassVector';
import { Angle } from './ClassAngle';
import { Canvas } from './ClassCanvas';
import { Quad } from './ClassQuad';
import { Color } from './ClassColor';
import { RenderQueue } from './ClassRenderQueue';
import { Renderable } from './ClassRenderable';
import { Axis } from './EnumAxis';

export { Shape };

class Shape extends Renderable {
  public quads: Quad[];
  constructor(x: number, y: number, z: number) {
    super(x, y, z);
    this.quads = [];
  }

  addQuad(quad: Quad) {
    this.quads.push(quad);
  }

  getCenter(): Point {
    let avg = new Point(0, 0, 0);
    for (let quad of this.quads) {
      let quadCenter = quad.getCenter();
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

  // rotate(pivot: Point, axis: Axis, angle: Angle) {
  //   for (let quad of this.quads) quad.rotate(pivot, axis, angle);
  // }

  // translate(vec: Vector) {
  //   for (let quad of this.quads) quad.translate(vec);
  // }

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
      quad.setColor(litColor.lightParallel(quad.getNormal(), vector, 1, darkness));
    }
  }

  draw(canvas: Canvas) {
    for (let quad of this.quads) quad.draw(canvas);
  }

  drawNormals(renderQueue: RenderQueue) {
    for (let q of this.quads) {
      q.drawNormal(renderQueue);
    }
  }
}
