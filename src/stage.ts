import { Container, type Application, type Renderer } from "pixi.js";
import { Tile } from "./tile";

// メモ
// このアルゴリズムは，ある方向に扇形を構成するようにタイルを配置していく．
// この方向を6回することで，六角形のタイルを構成することができる．

// 扇形のアルゴリズムは，1, 2, 3, 4,... というようにタイルを伸ばしていく．
// 最初のタイルのみ，2つ配置し，それ以降は1つずつ配置する．

export class Stage {
	private _container: Container;
	private _tiles: Tile[];
	constructor(x: number, y: number, radius: number, level: number) {
		this._container = new Container();
		this._tiles = [];

		const centerTile = new Tile({ x: x, y: y, number: 0, radius: radius });
		this._tiles.push(centerTile);

		for (let direction = 0; direction < 6; direction++) {
			let currentLayer = [centerTile.AddTile(direction)];
			this._tiles.push(...currentLayer);

			for (let layerIndex = 2; layerIndex <= level; layerIndex++) {
				currentLayer = addLayer(currentLayer, direction);
				this._tiles.push(...currentLayer);
			}
		}

		for (const tile of this._tiles) {
			this._container.addChild(tile.container);
		}
	}

	get container() {
		return this._container;
	}
}

function addLayer(parentLayer: Tile[], direction: number): Tile[] {
	return parentLayer.flatMap((parentTile, index) => {
		const newTiles = [parentTile.AddTile(direction + 1)];
		if (index === 0) {
			newTiles.unshift(parentTile.AddTile(direction));
		}
		return newTiles;
	});
}
