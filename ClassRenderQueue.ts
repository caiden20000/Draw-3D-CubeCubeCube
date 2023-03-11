import { Shape } from './ClassShape';
import { Angle } from './ClassAngle';
import { Vector } from './ClassVector';
import { Point } from './ClassPoint';
import { Canvas } from './ClassCanvas';
import { Axis } from './EnumAxis';
import { Position, Rotation, Style } from './Components';
import { Camera } from './ClassCamera';

export { RenderQueue };

interface Renderable {
  position: Position;
  rotation: Rotation;
  style: Style;
  draw(camera: Camera): void;
}

class RenderQueue {
  public renderQueue: Renderable[];
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
    this.renderQueue.sort((a, b) => b.getPosition().z - a.getPosition().z);
  }

  sortQueueByDistanceToOrigin() {
    this.renderQueue.sort(
      (a, b) =>
        b.getPosition().distanceTo(Point.ORIGIN()) -
        a.getPosition().distanceTo(Point.ORIGIN())
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
