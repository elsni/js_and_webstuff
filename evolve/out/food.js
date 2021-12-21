export class Food {
    constructor(pos, amount) {
        this._color = ["#ffffff", "#e6f2fc", "#dbefff", "#c9e7ff", "#b8defc", "#a3d6ff", "#5e85a6", "#3f688a", "#224766", "#0d2c45", "#021524"];
        this._pos = pos;
        this._amount = amount;
    }
    get amount() { return this._amount; }
    set amount(value) {
        this._amount = value;
    }
    get field() { return this._field; }
    set field(value) { this._field = value; }
    get pos() { return this._pos; }
    set pos(value) { this._pos = value; }
    draw(f) {
        var cindex = this._amount > 10 ? 10 : this._amount;
        f.g.color(this._color[cindex]);
        f.g.box(this.pos);
    }
}
