import { toolbox } from "./toolbox.js";
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
    // get coordinate offsets from all adjacent cells
    static get aroundOffsets() {
        if (Coord._buff)
            return Coord._buff;
        var result = [];
        Coord._around.forEach(elem => result.push(new Coord(elem[0], elem[1])));
        Coord._buff = result;
        return result;
    }
    set y(value) {
        this._y = value;
    }
    // Check is a given ccordinate is next to THIS coordinate
    isNextTo(p) {
        var result = false;
        var dist = Math.sqrt(Math.pow(Math.abs(p.x - this._x), 2) + Math.pow(Math.abs(p.y - this._y), 2));
        return (dist > 0 && dist < 2);
    }
    isEqual(p) {
        return ((p.x === this._x) && (p.y === this._y));
    }
    toString() {
        return '(' + this._x + "," + this._y + ")";
    }
    offset(c) {
        return new Coord(this._x + c.x, this._y + c.y);
    }
    static getRandom(maxX, maxY) {
        return new Coord(toolbox.getRandomInt(0, maxX), toolbox.getRandomInt(0, maxY));
    }
}
Coord._around = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];
