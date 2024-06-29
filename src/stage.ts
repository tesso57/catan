import { PI_2 } from "pixi.js";
import { Hexagon } from "./hexagon";

export function Stage(app, x, y, radius) {
  const b = Hexagon(x, y, radius);
  app.stage.addChild(b);
  for (let i = 0; i < 7; i++) {
    const angle = (i * PI_2) / 6;
    const nx = Math.sqrt(3) * radius * Math.cos(angle);
    const ny = Math.sqrt(3) * radius * Math.sin(angle);
    const h = Hexagon(x + nx, y + ny, radius);
    app.stage.addChild(h);
  }
}
