import { Camera } from './ClassCamera';
import { Color } from './ClassColor';
import { Point } from './ClassPoint';
import { Renderable, RenderQueue } from './ClassRenderQueue';
import { Vector } from './ClassVector';
import { Position, Rotation, Style } from './Components';

export { Poly };

class Poly {
  public position: Position;
  public rotation: Rotation;
  public style: Style;
  constructor(public points: Point[] = []) {
    this.position = Position.fromPoints(points);
    this.position.targets.push(
      ...Position.getPositionArrayFromPoints(this.points)
    );
    this.rotation = new Rotation(this.position);
    this.rotation.targets.push(
      ...Rotation.getRotationArrayFromPoints(this.points)
    );
    this.style = new Style(Color.RED);
  }

  // Try to do it in a counter-clockwise fashion, yes?
  addPoint(point: Point) {
    this.points.push(point);
    this.position.targets.push(point.position);
    this.rotation.targets.push(point.rotation);
  }

  stage(objects: Renderable[]) {
    objects.push(this);
  }

  draw(camera: Camera) {
    let projectedPositions = camera.polyToScreenSpace(
      Position.getPositionArrayFromPoints(this.points)
    );
    if (projectedPositions == null) return; // Don't draw if poly is offscreen

    let ctx = camera.canvas.ctx;

    this.style.applyColor(camera.canvas);
    ctx.beginPath();
    ctx.moveTo(projectedPositions[0].x, projectedPositions[0].y);
    for (let pp of projectedPositions) ctx.lineTo(pp.x, pp.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  /**
   * Minimum of 3 points, else returns Zero vector
   */
  getNormal(): Vector {
    if (this.points.length < 3) return new Vector(0, 0, 0);
    let v1 = Vector.fromPositions(
      this.points[0].position,
      this.points[1].position
    );
    let v2 = Vector.fromPositions(
      this.points[0].position,
      this.points[this.points.length - 1].position
    );
    let n = Vector.crossProduct(v1, v2);
    n.invert();
    return n;
  }

  // drawNormal(renderQueue: RenderQueue) {
  //   renderQueue.addRenderable(
  //     DrawableVector.fromVector(this.getCenter(), this.getNormal())
  //   );
  // }
}
