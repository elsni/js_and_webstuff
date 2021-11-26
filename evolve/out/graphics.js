export class Graphics {
    constructor(canvasId, xres, yres) {
        var canvas = document.getElementById(canvasId);
        this.width = canvas.width;
        this.height = canvas.height;
        this.canvasId = canvasId;
        this.ctx = canvas.getContext("2d");
        this.xres = xres;
        this.yres = yres;
        this.xfact = this.width / xres;
        this.yfact = this.height / yres;
    }
    clear() {
        var oldstyle = this.ctx.fillStyle;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = oldstyle;
    }
    plot(x, y) {
        this.ctx.fillRect(x * this.xfact, y * this.yfact, ((x + 1) * this.xfact) - 1, ((y + 1) * this.yfact) - 1);
    }
    color(col) {
        this.ctx.fillStyle = col;
    }
}
