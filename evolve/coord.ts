export class Coord {
    private _x: number = 0;
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    private _y: number = 0;
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    isAround(p:Coord ) : boolean {
        return (Math.abs(p.x-this._x) ===1 || Math.abs(p.y-this._y) ===1);
    }

    isEqual(p:Coord) :boolean {
        return ((p.x===this._x) && (p.y===this._y));
    }

    toString():string {
        return '('+this._x+","+this._y+")";
    }
}
