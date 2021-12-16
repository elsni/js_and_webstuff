export class Coord {
    constructor(x, y) {
        this._x = 0;
        this._y = 0;
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    isAround(p) {
        return (Math.abs(p.x - this._x) === 1 || Math.abs(p.y - this._y) === 1);
    }
    isEqual(p) {
        return ((p.x === this._x) && (p.y === this._y));
    }
    toString() {
        return '(' + this._x + "," + this._y + ")";
    }
}
