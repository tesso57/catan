import { ColorSource, Container, Graphics, PI_2, Text } from "pixi.js";

export interface Tile {
  container: Container;
  number: number;
  radius: number;
}

// カタンのタイルを作成
export function Tile(x, y, number: number, radius): Tile {
  // コンテナ定義
  const container = new Container();
  const hex = Hexagon(radius, 0x000000);
  const text = new Text({
    text: number.toString(),
    style: { fill: 0xffffff },
    anchor: 0.5,
  });

  container.addChild(hex, text);
  container.position.set(x, y);

  return { container, number, radius };
}

// カタンのタイルの六角形を作成
function Hexagon(radius: number, color: ColorSource) {
  const hex = new Graphics();
  for (let i = 0; i < 7; i++) {
    const angle = (i * PI_2) / 6 - PI_2 / 4;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    if (i === 0) {
      hex.moveTo(x, y);
    } else {
      hex.lineTo(x, y);
    }
  }
  hex.stroke({ color: color, width: 2 });
  return hex;
}

// タイルを追加する
export function AddTile(hex: Tile, number: number, dir: number) {
  const angle = (dir * PI_2) / 6;
  const nx = Math.sqrt(3) * hex.radius * Math.cos(angle);
  const ny = Math.sqrt(3) * hex.radius * Math.sin(angle);
  return Tile(hex.container.x + nx, hex.container.y + ny, number, hex.radius);
}
