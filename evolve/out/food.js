export class Food {
    constructor(pos, amount) {
        this._color = ["#ffffff", "#99ffcc", "#88ff99", "#77ff66", "#66ff33", "#55ff00", "#44cc00", "#339900", "#226600", "#113300", "#000000"];
        this._pos = pos;
        this._amount = amount;
    }
    get amount() { return this._amount; }
    set amount(value) { this._amount = value; }
    get field() { return this._field; }
    set field(value) { this._field = value; }
    get pos() { return this._pos; }
    set pos(value) { this._pos = value; }
    draw(f) {
        // f.g.color("#000000");
        var cindex = this._amount > 10 ? 10 : this._amount;
        f.g.color(this._color[cindex]);
        console.log(this._color[cindex]);
        f.g.box(this._pos);
    }
}
