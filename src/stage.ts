import { Container, Graphics, PI_2 } from "pixi.js";
import { Tile } from "./tile";

// メモ
// このアルゴリズムは，ある方向に扇形を構成するようにタイルを配置していく．
// この方向を6回することで，六角形のタイルを構成することができる．

// 扇形のアルゴリズムは，1, 2, 3, 4,... というようにタイルを伸ばしていく．
// 最初のタイルのみ，2つ配置し，それ以降は1つずつ配置する．

const CIRCLE_RADIUS = 10;
const ROAD_WIDTH = 6;
const ROAD_LENGTH = 14;

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
		// * 100 しているのは，浮動小数点の誤差を考慮している．
		this._tiles.sort((a, b) => {
			if (Math.round(a.container.y * 100) !== Math.round(b.container.y * 100)) {
				return (
					Math.round(a.container.y * 100) - Math.round(b.container.y * 100)
				);
			}
			return Math.round(a.container.x * 100) - Math.round(b.container.x * 100);
		});

		for (const [i, tile] of this._tiles.entries()) {
			// console.log(i, tile.container.x, tile.container.y);
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

	public genCircle() {
		// 頂点の円を描画
		const circles: Graphics[] = unique(
			this._tiles.flatMap((tile) => {
				const pos = tile.container.position;
				const tmp: Graphics[] = [];
				for (let i = 0; i < 6; i++) {
					const angle = (i * PI_2) / 6 - PI_2 / 4;
					const x = this._radius * Math.cos(angle);
					const y = this._radius * Math.sin(angle);
					tmp.push(
						new Graphics()
							.circle(pos.x + x, pos.y + y, CIRCLE_RADIUS)
							.fill(0xffffff),
					);
				}
				return tmp;
			}),
		);

		this._container.addChild(...circles);

		// 道を描画
		const roads: Graphics[] = [];
		for (const [i, circle] of circles.entries()) {
			const nexts = circles.filter((c, j) => {
				if (i === j) {
					return false;
				}
				return distance(circle, c) <= this._radius * 1.1;
			});

			for (const next of nexts) {
				const angle = Math.atan2(
					position(circle).y - position(next).y,
					position(circle).x - position(next).x,
				);

				const midpoint = {
					x: (position(circle).x + position(next).x) / 2,
					y: (position(circle).y + position(next).y) / 2,
				};

				const road = new Graphics()
					.moveTo(
						midpoint.x + ROAD_LENGTH * Math.cos(angle),
						midpoint.y + ROAD_LENGTH * Math.sin(angle),
					)
					.lineTo(
						midpoint.x - ROAD_LENGTH * Math.cos(angle),
						midpoint.y - ROAD_LENGTH * Math.sin(angle),
					)
					.stroke({ color: 0xffffff, width: ROAD_WIDTH });

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
					Math.abs(position(elem).x - position(cur).x) > 0.1 ||
					Math.abs(position(elem).y - position(cur).y) > 0.1,
			)
		) {
			acc.push(cur);
		}
		return acc;
	}, []);
}

function position(a: Graphics) {
	return {
		x: a.bounds.x + a.bounds.width / 2,
		y: a.bounds.y + a.bounds.height / 2,
	};
}

function distance(a: Graphics, b: Graphics) {
	const dx = position(a).x - position(b).x;
	const dy = position(a).y - position(b).y;
	return Math.sqrt(dx ** 2 + dy ** 2);
}
