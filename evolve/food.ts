import { Coord } from "./coord.js";
import { Field } from "./field.js";
import { toolbox } from "./toolbox.js";


export class Food {
    private _pos: Coord;
    private _field: Field;
    private _amount: number;
    private _color = ["#ffffff", "#e6f2fc", "#dbefff", "#c9e7ff", "#b8defc", "#a3d6ff", "#5e85a6", "#3f688a", "#224766", "#0d2c45", "#021524"]

    public get amount(): number { return this._amount; }
    public set amount(value: number) {

        this._amount = value;

    }

    public get field(): Field { return this._field; }
    public set field(value: Field) { this._field = value; }

    public get pos(): Coord { return this._pos; }
    public set pos(value: Coord) { this._pos = value; }

    constructor(pos: Coord, amount: number) {
        this._pos = pos;
        this._amount = amount;
    }

    public draw(f: Field) {
        var cindex = this._amount > 10 ? 10 : this._amount;
        f.g.color(this._color[cindex]);
        f.g.box(this.pos);
    }
}