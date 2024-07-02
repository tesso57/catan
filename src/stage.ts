import { Container, Graphics, PI_2 } from "pixi.js";
import { Tile } from "./tile";
import { ObjectPool } from "./objectPool";

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
	private _level: number;
	private _x: number;
	private _y: number;
	private _graphicPool: ObjectPool<Graphics>;

	constructor(x: number, y: number, radius: number, level: number) {
		// メンバー変数の初期化
		this._container = new Container();
		this._tiles = [];
		this._radius = radius;
		this._level = level;
		this._x = x;
		this._y = y;
		this._graphicPool = new ObjectPool(() => new Graphics());

		this.Create(x, y);
	}

	get container() {
		return this._container;
	}

	set level(level: number) {
		if (this._level !== level) {
			this._level = level;
			this._tiles = [];
			for (const child of this._container.children) {
				if (child instanceof Graphics) {
					child.clear();
					this._graphicPool.Return(child);
				}
			}
			this._container.removeChildren();
			this.Create(this._x, this._y);
		}
	}

	public Init() {
		for (const [i, tile] of this._tiles.entries()) {
			tile.number = i;
			// tile.number = Math.floor(Math.random() * 12) + 1;
			tile.type = Math.floor(Math.random() * 6);
		}
	}

	public Create(x: number, y: number) {
		const centerTile = new Tile({
			x: x,
			y: y,
			number: 0,
			radius: this._radius,
		});
		this._tiles.push(centerTile);

		for (let direction = 0; direction < 6; direction++) {
			let currentLayer = [centerTile.AddTile(direction)];
			this._tiles.push(...currentLayer);

			for (let layerIndex = 2; layerIndex <= this._level; layerIndex++) {
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
		const tileContainer = new Container();
		for (const [i, tile] of this._tiles.entries()) {
			// console.log(i, tile.container.x, tile.container.y);
			tileContainer.addChild(tile.container);
		}
		this._container.addChild(tileContainer);
		this.genCircle();
		this.Init();
	}

	public genCircle() {
		const vertexes = new Set();
		// 頂点の円を描画
		const circles: Graphics[] = this._tiles.flatMap((tile) => {
			const pos = tile.container.position;
			const tmp: Graphics[] = [];
			for (let i = 0; i < 6; i++) {
				const angle = (i * PI_2) / 6 - PI_2 / 4;
				const x = this._radius * Math.cos(angle);
				const y = this._radius * Math.sin(angle);
				const key = `${Math.floor(pos.x + x)},${Math.floor(pos.y + y)}`;
				if (vertexes.has(key)) {
					continue;
				}
				vertexes.add(key);
				const g = this._graphicPool.Get();
				tmp.push(g.circle(pos.x + x, pos.y + y, CIRCLE_RADIUS).fill(0xffffff));
			}
			return tmp;
		});
		this._container.addChild(...circles);

		// 道を描画
		const roadSet = new Set();
		const roads: Graphics[] = [];
		for (const [i, circle] of circles.entries()) {
			const circlePos = position(circle);

			const nexts: Graphics[] = [];
			for (const [j, c] of circles.entries()) {
				if (i === j) {
					continue;
				}
				if (nexts.length > 3) {
					break;
				}

				const nextPos = position(c);
				const dx = circlePos.x - nextPos.x;
				const dy = circlePos.y - nextPos.y;
				const dist = dx ** 2 + dy ** 2;

				if (this._radius ** 2 * 0.5 < dist && dist <= this._radius ** 2 * 1.1) {
					nexts.push(c);
				}
			}

			for (const next of nexts) {
				const nextPos = position(next);
				const angle = Math.atan2(
					circlePos.y - nextPos.y,
					circlePos.x - nextPos.x,
				);

				const midpoint = {
					x: (circlePos.x + nextPos.x) / 2,
					y: (circlePos.y + nextPos.y) / 2,
				};

				const key = `${Math.floor(midpoint.x * 10)},${Math.floor(midpoint.y * 10)}`;
				if (roadSet.has(key)) {
					continue;
				}
				roadSet.add(key);
				const road = this._graphicPool.Get();
				road
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
		this._container.addChild(...roads);
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

function position(a: Graphics) {
	return {
		x: a.bounds.x + a.bounds.width / 2,
		y: a.bounds.y + a.bounds.height / 2,
	};
}
