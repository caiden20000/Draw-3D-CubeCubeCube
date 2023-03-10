import { Angle } from "./ClassAngle";
import { Canvas } from "./ClassCanvas";
import { Point } from "./ClassPoint";
import { Renderable } from "./ClassRenderable";
import { Vector } from "./ClassVector";
import { Axis } from "./EnumAxis";

class DrawableVector extends Renderable {
  constructor(
    public vector: Vector,
    public origin: Point,
    public length: number = 50
  ) {
    super(origin.x, origin.y, origin.z);
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

  getMidpoint() {
    let avg = new Point(0, 0, 0);
    avg.x = (this.origin.x + this.vector.x) / 2;
    avg.y = (this.origin.y + this.vector.y) / 2;
    avg.z = (this.origin.z + this.vector.z) / 2;
    return avg;
  }
  
  // TODO: get, set, translate position must be in relation to midpoint

  // TODO: rotation
}