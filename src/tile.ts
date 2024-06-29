import { ColorSource, Container, Graphics, PI_2, Text } from "pixi.js";
import { ResourceEnum, ResourceColor } from "./resourceType";

export class Tile {
  private _container: Container;
  private _number: number;
  private _radius: number;
  private _type: ResourceEnum;

  constructor(params: {
    x: number;
    y: number;
    number?: number;
    radius: number;
    type?: ResourceEnum;
  }) {
    this._number = params.number ?? 0;
    this._radius = params.radius;
    this._type = params.type ?? ResourceEnum.Desert;

    // コンテナ定義
    const container = new Container();
    // 六角形の描画
    const hex = hexagon(params.radius, 0x000000);
    hex.fill(ResourceColor(this._type));
    // 数字の描画
    const text = new Text({
      text: this._number.toString(),
      style: { fill: 0xffffff },
      anchor: 0.5,
    });

    container.addChild(hex, text);
    container.position.set(params.x, params.y);
    this._container = container;
  }

  get container() {
    return this._container;
  }

  // 隣接するタイルを追加
  // 0は，右上方向
  public AddTile(dir: number): Tile {
    const angle = (dir * PI_2) / 6;
    const nx = Math.sqrt(3) * this._radius * Math.cos(angle);
    const ny = Math.sqrt(3) * this._radius * Math.sin(angle);
    return new Tile({
      x: this._container.x + nx,
      y: this._container.y + ny,
      radius: this._radius,
    });
  }
}

// カタンのタイルの六角形を作成
function hexagon(radius: number, color: ColorSource) {
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
