export class Graphics {

    canvasId: string;
    width: number;
    height: number;
    xres: number;
    yres: number;
    ctx: CanvasRenderingContext2D;
    xfact:number;
    yfact:number;

    constructor(canvasId: string, xres:number, yres:number) {
        var canvas = <HTMLCanvasElement> document.getElementById(canvasId);
        this.width = canvas.width;
        this.height = canvas.height;
        this.canvasId = canvasId;
        this.ctx = canvas.getContext("2d");
        this.xres=xres;
        this.yres=yres;
        this.xfact=this.width / xres;
        this.yfact=this.height / yres;
    }

    clear() {
        var oldstyle = this.ctx.fillStyle;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0,0,this.width, this.height);
        this.ctx.fillStyle = oldstyle;
    }
    plot(x:number,y:number) {
        this.ctx.fillRect(x * this.xfact,y * this.yfact,((x+1)*this.xfact)-1, ((y+1)*this.yfact)-1);
    }

    color(col:string) {
        this.ctx.fillStyle = col;
    }
}