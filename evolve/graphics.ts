import { Coord } from "./coord.js";

export class Graphics {

    canvasId: string;
    private _width: number;
    private _height: number;
    private _xres: number;
    private _yres: number;
    private _ctx: CanvasRenderingContext2D;
    private _xfact: number;
    private _yfact: number;

    constructor(canvasId: string, xres: number, yres: number) {
        var canvas = <HTMLCanvasElement>document.getElementById(canvasId);
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

    get xres(): number { return this._xres; }
    get yres(): number { return this._yres; }

    public clear() {
        var oldstyle = this._ctx.fillStyle;
        this._ctx.fillStyle = "#ffffff";
        this._ctx.fillRect(0, 0, this._width, this._height);
        this._ctx.fillStyle = oldstyle;
    }
    public plot(p:Coord) {
        this._ctx.fillRect(p.x * this._xfact, p.y * this._yfact, this._xfact - 1, this._yfact - 1);
    }
    public box(p:Coord) {
        this._ctx.strokeRect(p.x * this._xfact+0.5, p.y * this._yfact+0.5, this._xfact - 0.5, this._yfact - 0.5);
    }

    public color(col: string) {
        this._ctx.fillStyle = col;
        this._ctx.strokeStyle = col;
    }
}
