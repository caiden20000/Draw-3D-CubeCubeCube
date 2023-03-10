import { Angle } from './ClassAngle';
import { Point } from './ClassPoint';
import { Quad } from './ClassQuad';
import { Shape } from './ClassShape';

export { Cube };

class Cube extends Shape {
  constructor(public center: Point, public size: number) {
    super(center.x, center.y, center.z);
    this.init();
  }

  init() {
    this.quads = [];
    let hs = this.size / 2;
    // Front
    this.addQuad(
      new Quad(
        new Point(hs, hs, -hs),
        new Point(-hs, hs, -hs),
        new Point(-hs, -hs, -hs),
        new Point(hs, -hs, -hs)
      )
    );
    // Back
    this.addQuad(
      new Quad(
        new Point(hs, hs, hs),
        new Point(hs, -hs, hs),
        new Point(-hs, -hs, hs),
        new Point(-hs, hs, hs)
      )
    );
    // Left
    this.addQuad(
      new Quad(
        new Point(-hs, hs, -hs),
        new Point(-hs, hs, hs),
        new Point(-hs, -hs, hs),
        new Point(-hs, -hs, -hs)
      )
    );
    // Right
    this.addQuad(
      new Quad(
        new Point(hs, hs, -hs),
        new Point(hs, -hs, -hs),
        new Point(hs, -hs, hs),
        new Point(hs, hs, hs)
      )
    );
    // Top
    this.addQuad(
      new Quad(
        new Point(hs, hs, hs),
        new Point(-hs, hs, hs),
        new Point(-hs, hs, -hs),
        new Point(hs, hs, -hs)
      )
    );
    // Bottom
    this.addQuad(
      new Quad(
        new Point(hs, -hs, hs),
        new Point(hs, -hs, -hs),
        new Point(-hs, -hs, -hs),
        new Point(-hs, -hs, hs)
      )
    );

    this.translate(this.center.toVector());
  }
}
