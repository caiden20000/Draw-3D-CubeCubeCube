import { Shape } from './ClassShape';
import { Angle } from './ClassAngle';
import { Vector } from './ClassVector';
import { Point } from './ClassPoint';
import { Canvas } from './ClassCanvas';
import { Axis } from './EnumAxis';
import { Position, Rotation, Style } from './Components';
import { Camera } from './ClassCamera';

export { RenderQueue, Stageable, Renderable };

interface Stageable {
  stage(objects: Renderable[]);
}

interface Renderable {
  position: Position;
  rotation: Rotation;
  style: Style;
  draw(camera: Camera): void;
}

class RenderQueue {
  public stagingQueue: Stageable[];
  public renderQueue: Renderable[];
  constructor() {
    this.stagingQueue = [];
    this.renderQueue = [];
  }

  // Call this after everything is staged
  rotateCamera(axis: Axis, angle: Angle) {
    angle.invert();
    for (let p of this.renderQueue)
      p.rotation.rotate(axis, angle, Position.ORIGIN);
  }

  translateCamera(vec: Vector) {
    vec.invert();
    for (let p of this.renderQueue) p.position.translateByVector(vec);
  }

  addStageable(r: Stageable) {
    this.stagingQueue.push(r);
  }

  sortQueueByZ() {
    // Hopefully sorts descending Z
    this.renderQueue.sort((a, b) => b.position.z - a.position.z);
  }

  // Currently the best
  sortQueueByDistanceToOrigin() {

    this.renderQueue.sort(
      (a, b) =>
        b.position.getDistance(Position.ORIGIN) -
        a.position.getDistance(Position.ORIGIN)
    );
  }

  clearRenderQueue() {
    this.stagingQueue = [];
    this.renderQueue = [];
  }

  // Call before rendering
  stage() {
    for (let r of this.stagingQueue) r.stage(this.renderQueue);
  }

  // Draws all Drawable in renderQueue in order
  // Clears the renderQueue, add things every frame!
  render(camera: Camera) {
    this.sortQueueByDistanceToOrigin();
    // for (let i=0; i<this.renderQueue.length; i++) {
    //   this.renderQueue[i].draw(camera);
    // }
    for (let r of this.renderQueue) r.draw(camera);
    this.clearRenderQueue();
  }
}
