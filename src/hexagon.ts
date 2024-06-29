import { Graphics, PI_2 } from "pixi.js";

export function Hexagon(x, y, radius): Graphics {
  const graphics = new Graphics();

  for (let i = 0; i < 7; i++) {
    const angle = (i * PI_2) / 6 - PI_2 / 4;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    if (i === 0) {
      graphics.moveTo(x, y);
    } else {
      graphics.lineTo(x, y);
    }
  }
  graphics.stroke({ color: 0x000, width: 2 });

  graphics.x = x;
  graphics.y = y;
  return graphics;
}
