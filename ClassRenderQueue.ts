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

  // // Call this after everything is staged
  // rotateCamera(axis: Axis, angle: Angle) {
  //   angle.invert();
  //   for (let p of this.renderQueue)
  //     p.rotation.rotate(axis, angle, Position.ORIGIN);
  // }

  // translateCamera(vec: Vector) {
  //   vec.invert();
  //   for (let p of this.renderQueue) p.position.translateByVector(vec);
  // }

  addStageable(r: Stageable) {
    this.stagingQueue.push(r);
  }

  sortQueueByZ() {
    // Hopefully sorts descending Z
    this.renderQueue.sort((a, b) => b.position.z - a.position.z);
  }

  // Second best
  // has issues though (?)
  // :-(
  sortQueueByDistanceToOrigin() {
    this.renderQueue.sort(
      (a, b) =>
        b.position.getDistance(Position.ORIGIN) -
        a.position.getDistance(Position.ORIGIN)
    );
  }

  // Current best
  // Has issues, possibly related to distance to origin != distance to screen
  sortQueueByDistanceToCamera(camera: Camera) {
    this.renderQueue.sort((a, b) => {
      let aCam = camera.toCameraSpace(a.position);
      let bCam = camera.toCameraSpace(b.position);
      return (
        bCam.getDistance(camera.position) - aCam.getDistance(camera.position)
      );
    });
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
    this.sortQueueByDistanceToCamera(camera);
    for (let r of this.renderQueue) r.draw(camera);
    this.clearRenderQueue();
  }
}
