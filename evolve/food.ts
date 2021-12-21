import { Coord } from "./coord.js";
import { Field } from "./field.js";
import {toolbox} from "./toolbox.js";


export class Food {
    private _pos: Coord;
    private _field: Field;
    private _amount: number;
    private _color = ["#ffffff", "#99ffcc", "#88ff99", "#77ff66", "#66ff33", "#55ff00", "#44cc00", "#339900", "#226600", "#113300", "#000000"]

    public get amount(): number {return this._amount; }
    public set amount(value: number) {this._amount = value; }

    public get field(): Field { return this._field; }
    public set field(value: Field) { this._field = value; }

    public get pos(): Coord { return this._pos; }
    public set pos(value: Coord) { this._pos = value; }

    constructor(pos:Coord ,amount:number ) {
        this._pos= pos;
        this._amount= amount;
    }

    public draw (f:Field) {
        // f.g.color("#000000");
        var cindex=this._amount>10? 10 : this._amount;
        f.g.color(this._color[cindex]);
        console.log(this._color[cindex]);
        f.g.box(this._pos);
    }
}