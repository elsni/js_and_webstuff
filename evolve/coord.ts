import {toolbox} from "./toolbox.js";

export class Coord {
    private _x: number = 0;
    private _y: number = 0;

    private static _around = [
        [-1,-1], [0,-1], [1,-1], 
        [-1, 0],         [1, 0], 
        [-1, 1], [0, 1], [1, 1] 
    ]

    private static _buff:Coord[];

    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    public get y(): number {
        return this._y;
    }

    // get coordinate offsets from all adjacent cells
    public static get aroundOffsets(): Coord[] {
        if (Coord._buff) return Coord._buff;
        var result:Coord[] = [];
        Coord._around.forEach(elem => result.push(new Coord(elem[0],elem[1])));
        Coord._buff= result;
        return result;
    }
    

    public set y(value: number) {
        this._y = value;
    }

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    // Check is a given ccordinate is next to THIS coordinate
    public isNextTo(p:Coord ) : boolean {
        var result = false;
        var dist = Math.sqrt(Math.abs(p.x-this._x)**2 + Math.abs(p.y-this._y)**2);
        return (dist>0 && dist < 2)
    }

    public isEqual(p:Coord) :boolean {
        return ((p.x===this._x) && (p.y===this._y));
    }

    public toString():string {
        return '('+this._x+","+this._y+")";
    }
    
    public offset(c:Coord) {
        return new Coord(this._x+c.x, this._y+c.y);
    }

    public static getRandom(maxX:number,maxY:number):Coord {
        return new Coord(toolbox.getRandomInt(0,maxX),toolbox.getRandomInt(0,maxY));
    }
}
