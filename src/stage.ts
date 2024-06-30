import {
	Container,
	Graphics,
	PI_2,
	type Application,
	type Renderer,
} from "pixi.js";
import { Tile } from "./tile";

// メモ
// このアルゴリズムは，ある方向に扇形を構成するようにタイルを配置していく．
// この方向を6回することで，六角形のタイルを構成することができる．

// 扇形のアルゴリズムは，1, 2, 3, 4,... というようにタイルを伸ばしていく．
// 最初のタイルのみ，2つ配置し，それ以降は1つずつ配置する．

export class Stage {
	private _container: Container;
	private _tiles: Tile[];
	private _radius: number;

	constructor(x: number, y: number, radius: number, level: number) {
		this._container = new Container();
		this._tiles = [];
		this._radius = radius;

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

		// 左上から順番に配置する．
		this._tiles.sort((a, b) => {
			if (a.container.y !== b.container.y) {
				return a.container.y - b.container.y;
			}
			return a.container.x - b.container.x;
		});

		for (const tile of this._tiles) {
			this._container.addChild(tile.container);
		}
	}

	get container() {
		return this._container;
	}

	public Init() {
		for (const [i, tile] of this._tiles.entries()) {
			tile.number = i;
			// tile.number = Math.floor(Math.random() * 12) + 1;
			tile.type = Math.floor(Math.random() * 6);
		}
	}

	private genCircle() {
		const circles: Graphics[] = [];
		for (const tile of this._tiles) {
			const pos = tile.container.position;
			for (let i = 0; i < 7; i++) {
				const angle = (i * PI_2) / 6 - PI_2 / 4;
				const x = this._radius * Math.cos(angle);
				const y = this._radius * Math.sin(angle);
				const circle = new Graphics()
					.circle(pos.x + x, pos.y + y, 10)
					.fill(0xffffff);

				circles.push(circle);
			}
		}

		const u = unique(circles);
		return u;
	}

	public genRoad() {
		const circles = this.genCircle();
		this._container.addChild(...circles);
		const roads: Graphics[] = [];
		for (const [i, circle] of circles.entries()) {
			const nexts = circles.filter((c, j) => {
				if (i === j) {
					return false;
				}
				const dx = (circle.bounds.x - c.bounds.x) ** 2;
				const dy = (circle.bounds.y - c.bounds.y) ** 2;
				return dx + dy < this._radius ** 2 * 1.1;
			});

			for (const next of nexts) {
				const road = new Graphics()
					.moveTo(
						circle.bounds.x + circle.bounds.width / 2,
						circle.bounds.y + circle.bounds.height / 2,
					)
					.lineTo(
						next.bounds.x + next.bounds.width / 2,
						next.bounds.y + next.bounds.height / 2,
					)
					.stroke({ color: 0xffffff, width: 1 });
				road.interactive = true;
				road.on("pointerdown", () => {
					road.tint = 0xff0000;
					console.log("pointerover");
				});
				roads.push(road);
			}
		}
		const u = unique(roads);
		this._container.addChild(...u);
		console.log(u.length);
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

function unique(arr: Graphics[]) {
	return arr.reduce((acc: Graphics[], cur: Graphics) => {
		if (
			acc.every(
				(elem) =>
					Math.abs(
						elem.bounds.x +
							elem.bounds.width / 2 -
							(cur.bounds.x + cur.bounds.width / 2),
					) > 0.1 ||
					Math.abs(
						elem.bounds.y +
							elem.bounds.height / 2 -
							(cur.bounds.y + cur.bounds.height / 2),
					) > 0.1,
			)
		) {
			acc.push(cur);
		}
		return acc;
	}, []);
}
