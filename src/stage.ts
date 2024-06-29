import { Application, Renderer } from "pixi.js";
import { AddTile, Tile } from "./tile";

function addLayer(
  parentLayer: Tile[],
  direction: number,
  tiles: Tile[]
): Tile[] {
  return parentLayer.flatMap((parentTile, index) => {
    const newTiles = [AddTile(parentTile, tiles.length, direction + 1)];
    if (index === 0) {
      newTiles.unshift(AddTile(parentTile, tiles.length, direction));
    }
    return newTiles;
  });
}

export function Stage(
  app: Application<Renderer>,
  x: number,
  y: number,
  radius: number,
  level: number
) {
  const tiles: Tile[] = [];

  const centerTile = Tile(x, y, 0, radius);
  tiles.push(centerTile);

  for (let direction = 0; direction < 6; direction++) {
    let currentLayer = [AddTile(centerTile, tiles.length, direction)];
    tiles.push(...currentLayer);

    for (let layerIndex = 2; layerIndex <= level; layerIndex++) {
      currentLayer = addLayer(currentLayer, direction, tiles);
      tiles.push(...currentLayer);
    }
  }

  tiles.forEach((tile) => app.stage.addChild(tile.container));
}

// メモ
// このアルゴリズムは，ある方向に扇形を構成するようにタイルを配置していく．
// この方向を6回することで，六角形のタイルを構成することができる．

// 扇形のアルゴリズムは，1, 2, 3, 4,... というようにタイルを伸ばしていく．
// 最初のタイルのみ，2つ配置し，それ以降は1つずつ配置する．
