import { Angle } from './ClassAngle';
import { Point } from './ClassPoint';
import { Quad } from './ClassQuad';
import { Shape } from './ClassShape';
import { Position } from './Components';

export { Cube };

class Cube extends Shape {
  constructor(x: number, y: number, z: number, public size: number) {
    super(0, 0, 0);
    this.init();
    this.position.translate(x, y, z);
  }

  init() {
    this.polys = [];
    let hs = this.size / 2;
    // Front
    this.addPoly(
      new Quad(
        new Point(hs, hs, -hs),
        new Point(-hs, hs, -hs),
        new Point(-hs, -hs, -hs),
        new Point(hs, -hs, -hs)
      )
    );
    // Back
    this.addPoly(
      new Quad(
        new Point(hs, hs, hs),
        new Point(hs, -hs, hs),
        new Point(-hs, -hs, hs),
        new Point(-hs, hs, hs)
      )
    );
    // Left
    this.addPoly(
      new Quad(
        new Point(-hs, hs, -hs),
        new Point(-hs, hs, hs),
        new Point(-hs, -hs, hs),
        new Point(-hs, -hs, -hs)
      )
    );
    // Right
    this.addPoly(
      new Quad(
        new Point(hs, hs, -hs),
        new Point(hs, -hs, -hs),
        new Point(hs, -hs, hs),
        new Point(hs, hs, hs)
      )
    );
    // Top
    this.addPoly(
      new Quad(
        new Point(hs, hs, hs),
        new Point(-hs, hs, hs),
        new Point(-hs, hs, -hs),
        new Point(hs, hs, -hs)
      )
    );
    // Bottom
    this.addPoly(
      new Quad(
        new Point(hs, -hs, hs),
        new Point(hs, -hs, -hs),
        new Point(-hs, -hs, -hs),
        new Point(-hs, -hs, hs)
      )
    );
  }
}
