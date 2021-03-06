import { Coord } from "./coord.js";
export class Graphics {
    constructor(canvasId, xres, yres) {
        var canvas = document.getElementById(canvasId);
        canvas.addEventListener("mousedown", ev => this.mouseDispatcher(ev));
        this._width = canvas.width;
        this._height = canvas.height;
        this.canvasId = canvasId;
        this._ctx = canvas.getContext("2d");
        this._ctx.imageSmoothingEnabled = false;
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
        this._ctx.strokeRect(p.x * this._xfact + 0.5, p.y * this._yfact + 0.5, this._xfact - 0.5, this._yfact - 0.5);
    }
    color(col) {
        this._ctx.fillStyle = col;
        this._ctx.strokeStyle = col;
    }
    setMouseEventHandler(handler) {
        this._mouseEventHandler = handler;
    }
    mouseDispatcher(event) {
        if (this._mouseEventHandler) {
            this._mouseEventHandler(new Coord(Math.floor((event.layerX - 1) / this._xfact), Math.floor((event.layerY - 1) / this._yfact)));
        }
    }
}
