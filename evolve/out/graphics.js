export class Graphics {
    constructor(canvasId, xres, yres) {
        var canvas = document.getElementById(canvasId);
        this._width = canvas.width;
        this._height = canvas.height;
        this.canvasId = canvasId;
        this._ctx = canvas.getContext("2d");
        this._xres = xres;
        this._yres = yres;
        this._xfact = this._width / xres;
        this._yfact = this._height / yres;
    }
    get xres() { return this._xres; }
    get yres() { return this._yres; }
    clear() {
        var oldstyle = this._ctx.fillStyle;
        this._ctx.fillStyle = "#ffffff";
        this._ctx.fillRect(0, 0, this._width, this._height);
        this._ctx.fillStyle = oldstyle;
    }
    plot(p) {
        this._ctx.fillRect(p.x * this._xfact, p.y * this._yfact, this._xfact - 1, this._yfact - 1);
    }
    box(p) {
        this._ctx.strokeRect(p.x * this._xfact, p.y * this._yfact, this._xfact - 1, this._yfact - 1);
    }
    color(col) {
        this._ctx.fillStyle = col;
        this._ctx.strokeStyle = col;
    }
}
