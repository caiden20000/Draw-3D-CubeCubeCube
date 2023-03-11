import { Vector } from './ClassVector';
import { Color } from './ClassColor';
import { Position, Rotation, Style } from './Components';
import { Poly } from './ClassPoly';
import { Renderable } from './ClassRenderQueue';

export { Shape };

// VERY INCOMPLETE

class Shape {
  public position: Position;
  public rotation: Rotation;
  public style: Style;
  public polys: Poly[];
  constructor(x: number, y: number, z: number) {
    this.position = new Position(x, y, z);
    this.rotation = new Rotation(this.position);
    this.style = new Style(Color.BLUE, Color.GREEN);
    this.polys = [];
  }

  addPoly(poly: Poly) {
    this.polys.push(poly);
    this.rotation.targets.concat(
      Rotation.getRotationArrayFromPoints(poly.points)
    );
    this.position.targets.concat(
      Position.getPositionArrayFromPoints(poly.points)
    );
  }

  updateColor() {
    for (let poly of this.polys) {
      poly.style.setFillColor(this.style.fillColor);
      poly.style.setStrokeColor(this.style.strokeColor);
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
    let litColor = this.style.fillColor.copy();
    litColor = litColor.multiply(intensity);
    for (let poly of this.polys) {
      poly.style.setColor(
        litColor.lightParallel(poly.getNormal(), vector, 1, darkness)
      );
    }
  }

  stage(objects: Renderable[]) {
    for (let p of this.polys) p.stage(objects);
  }

  // drawNormals(renderQueue: RenderQueue) {
  //   for (let poly of this.polys) {
  //     poly.drawNormal(renderQueue);
  //   }
  // }
}
