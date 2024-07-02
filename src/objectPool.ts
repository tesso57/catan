export class ObjectPool<T> {
	private _pool: T[] = [];
	private _create: () => T;

	constructor(create: () => T) {
		this._create = create;
	}

	public Get(): T {
		if (this._pool.length === 0) {
			return this._create();
		}
		return this._pool.pop() as T;
	}

	public Return(obj: T) {
		this._pool.push(obj);
	}
}
