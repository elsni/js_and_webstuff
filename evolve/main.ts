class Graphics {

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
    public plot(x: number, y: number) {
        this._ctx.fillRect(x * this._xfact, y * this._yfact, this._xfact - 1, this._yfact - 1);
    }
    public box(x: number, y: number) {
        this._ctx.strokeRect(x * this._xfact, y * this._yfact, this._xfact - 1, this._yfact - 1);
    }

    public color(col: string) {
        this._ctx.fillStyle = col;
        this._ctx.strokeStyle = col;
    }
}

class Coord {
    private _x: number = 0;
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    private _y: number = 0;
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }
}

// ----------------------------------------------------------------------------------------------------

class Field {
    private _g: Graphics;
    private _creatures: Creature[];
    private _food: number[][];
    private _foodcolor = ["#ffffff", "#ddffcc", "#bbff99", "#99ff66", "#77ff33", "55ff00", "#44cc00", "#339900", "#226600", "#113300"]

    public get g(): Graphics {
        return this._g;
    }

    constructor(g: Graphics) {
        this._creatures = [];
        this._food = [];
        this._g = g;
        for (var i: number = 0; i < g.xres; i++) {
            this._food[i] = [];
            for (var j: number = 0; j < g.yres; j++) {
                this._food[i][j] = 0;
            }
        }
    }

    public isFree(x: number, y: number): boolean {
        return !this._creatures.find(element => (element.x === x) && (element.y === y));
    }

    // gets a list of nearby creatures
    public getNearbyCreatures(x: number, y: number): Creature[] {
        return this._creatures.filter(element => (element.x >= x - 1) && (element.x <= x + 1) && (element.y >= y - 1) && (element.y <= y + 1) && !(element.x == x && element.y == y));
    }

    // gets all free cells around a coordinate
    public getNearbyFreeCells(x: number, y: number): Coord[] {
        var result: Array<Coord> = [];
        for (var i = x - 1; i <= x + 1; i++) {
            for (var j = y - 1; j <= y + 1; j++) {
                if (i >= 0 && i < this._g.xres) {
                    if (j >= 0 && j < this._g.yres) {
                        if (i !== x || j !== y) {
                            if (this.isFree(i, j)) {
                                result.push(new Coord(i, j));
                            }
                        }
                    }
                }
            }
        }
        return result;
    }

    public addFood(x: number, y: number, amount: number) {
        this._food[x][y] += amount;
    }

    public addCreature(c?: Creature) {
        if (c) {
            c.field = this;
            this._creatures.push(c);
        } else {
            this._creatures.push(new Creature(this));
        };
    }

    public draw() {

        // Draw food
        for (var i: number = 0; i < this._g.xres; i++) {
            for (var j: number = 0; j < this._g.yres; j++) {
                var food = Math.min(this._food[i][j], 9);

                if (food > 0) {
                    console.log("food at " + i + "," + j + " amount:" + food);
                    // the more food, the darker
                    this._g.color(this._foodcolor[food]);
                    this._g.box(i, j);
                }
            }
        }

        // Draw creatures
        this._creatures.forEach(element => element.draw());
    }
}

// --------------------------------------------------------------
class Creature {

    private _stats = {
        Attack: 5,
        Defense: 5,
        Poison: 5,
        Harvest: 5,
        Movement: 5,
        Reproduction: 5,
        Production: 5,
        Digestion: 5,
        Consumption: 5
    };

    private _xmax: number;
    private _ymax: number;
    private _x: number;
    private _y: number;
    private _field: Field;

    public get field(): Field {
        return this._field;
    }
    public set field(value: Field) {
        this._field = value;
    }

    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }

    public get xmax(): number {
        return this._xmax;
    }
    public get ymax(): number {
        return this._ymax;
    }
    public get stats() {
        return this._stats;
    }

    // 1 Food Item = 20 if digestion = 10. with digestion=5 its 10.
    // 1 Move cost 10-Movement energy points
    private _lifespan: number = 100;     // lifespan cycles
    private _age: number = 0;            // age of cycles
    private _progmem: number = 5;        // Number of instructions program memory
    private _pc: number = 0;               // Program counter
    private _energy: number = 100;        // Amount of energy
    private _progbuff: Array<number> = new Array(this._progmem);
    private _color: string = "#ffffff";

    private instructions: Array<string> = [
        "wait",
        "harvest",
        "watch",
        "produce",
        "move random",
        "move food",
        "hunt",
        "attack",
        "eat"
    ];

    // --------------------------------------------------------------

    constructor(f: Field, parent?: Creature, mutate?: boolean) {
        this._xmax = f.g.xres;
        this._ymax = f.g.yres;
        this._field = f;

        if (typeof parent !== 'undefined') {

            this._progbuff = [...parent._progbuff];
            this._stats.Attack = parent._stats.Attack;
            this._stats.Defense = parent._stats.Defense;
            this._stats.Poison = parent._stats.Poison;
            this._stats.Harvest = parent._stats.Harvest;
            this._stats.Movement = parent._stats.Movement;
            this._stats.Reproduction = parent._stats.Reproduction;
            this._stats.Production = parent._stats.Production;
            this._stats.Digestion = parent._stats.Digestion;
            this._stats.Consumption = parent._stats.Consumption;
            this._age = 0;
            this._lifespan = parent._lifespan;
            this._energy = Math.floor(parent._energy / 2);

            if (mutate) {
                this.mutate();
            }

        } else {
            this.randomize();
        };
    }

    // --------------------------------------------------------------
    private randomize() {

        this._x = this.getRnd(this._xmax);
        this._y = this.getRnd(this._ymax);
        this._progmem = this.getRnd(10);
        this._progbuff = new Array(this._progmem);

        // randomize programm
        for (var i: number = 0; i < this._progmem; i++) {
            this._progbuff[i] = this.getRnd(this.instructions.length);
        }

        // shuffle Stats
        for (i = 0; i <= 50; i++) {
            this.alterStats();
        }

        // randomize lifespan
        this._lifespan = this.getRnd(200) + 20;

        this.calculateColor();
    }

    // --------------------------------------------------------------
    // Change stats. sub 1 from one stat and add it to another
    private alterStats() {
        var keys = Object.keys(this._stats)
        var num = keys.length;
        var a = 0, b = 0;
        var va = 0, vb = 0;
        do {
            do {
                a = this.getRnd(num);
                b = this.getRnd(num);
            } while (a === b);
            va = this._stats[keys[a]] + 1;
            vb = this._stats[keys[b]] - 1;

        } while (va < 0 || va > 10 || vb < 0 || vb > 10)

        this._stats[keys[a]] = va;
        this._stats[keys[b]] = vb;
    }

    // --------------------------------------------------------------
    private getRnd(max: number): number {
        return Math.floor(Math.random() * max);
    }

    // --------------------------------------------------------------
    private mutate() {

        // always change stats slightly
        this.alterStats();

        // sometimes alter lifespan
        if (this.getRnd(3) == 1) {
            this._lifespan += this.getRnd(11) - 5;
            if (this._lifespan < 20) this._lifespan = 20;
            if (this._lifespan > 300) this._lifespan = 300;
        }
        // rarely change program size
        if (this.getRnd(10) == 2) {
            var oldpgm = this._progmem;
            this._progmem += this.getRnd(3) - 1;

            // if progmem gets bigger, push one random instruction to widen the array
            if (this._progmem > oldpgm) {
                this._progbuff.push(this.getRnd(this.instructions.length));
            }
        }

        // sometimes change one program instruction to a random one
        if (this.getRnd(5) == 1) {
            var instidx = this.getRnd(this._progmem);
            this._progbuff[instidx] = this.getRnd(this.instructions.length);
        }

    }

    public print() {
        this.printStats();
        this.printProgMem();
    }

    // --------------------------------------------------------------
    private calculateColor() {
        var predator = 0;
        var herbivore = 0;
        var plant = 0;

        predator = this._stats.Attack + this._stats.Movement;
        plant = this._stats.Harvest + this._stats.Production + this._stats.Poison;
        herbivore = this._stats.Defense + this._stats.Movement;

        for (var i: number = 0; i < this._progmem; i++) {
            switch (this._progbuff[i]) {
                case 0:
                case 1:
                case 3:
                    plant++;
                    break;
                case 2:
                case 4:
                case 5:
                case 8:
                    herbivore++;
                    break;
                case 6:
                case 7:
                case 8:
                    predator++;
            }
        }

        if (predator > 20) predator = 20;
        if (plant > 30) plant = 30;
        if (herbivore > 20) herbivore = 20;
        this._color = "#" + (Math.floor(255 / 20 * predator)).toString(16) + (Math.floor(255 / 30 * plant)).toString(16) + (Math.floor(255 / 30 * herbivore)).toString(16);

    }
    // --------------------------------------------------------------
    public printStats() {
        console.log("Pos (x,y)...:" + this._x + "," + this._y);
        console.log("Color.......:" + this._color);
        console.log("Energy......:" + this._energy);
        console.log("Age.........:" + this._age);
        console.log("Lifespan....:" + this._lifespan);
        console.log("-------------------------");
        console.log("Attack......:" + this._stats.Attack);
        console.log("Defense.....:" + this._stats.Defense);
        console.log("Poison......:" + this._stats.Poison);
        console.log("Harvest.....:" + this._stats.Harvest);
        console.log("Movement....:" + this._stats.Movement);
        console.log("Reproduction:" + this._stats.Reproduction);
        console.log("Production..:" + this._stats.Production);
        console.log("Digestion...:" + this._stats.Digestion);
        console.log("Consumption.:" + this._stats.Consumption);
        console.log("-------------------------");
    }

    // --------------------------------------------------------------
    public printProgMem() {
        console.log("Progmem.....:" + this._progmem);
        for (var i: number = 0; i < this._progmem; i++) {
            console.log(this.instructions[this._progbuff[i]]);
        }
    }

    public draw() {
        this._field.g.color(this._color);
        this._field.g.plot(this._x, this._y);
    }

    // --------------------------------------------------------------
    tick() {
        var instr = this._progbuff[this._pc];
        this._pc++;
        if (this._pc == this._progmem) this._pc = 0;

        switch (instr) {
            case 0:
                //wait -  do nothing
                break;
            case 1:
                // harvest Energy according to efficiency
                this._energy += this._stats.Harvest;
                break;
            case 2:
                // move in opposite direction if another creature is nearby
                var nearcreature = this._field.getNearbyCreatures(this._x, this._y);

                break;
            case 3:
                // produce food item in nearby field if energy level is sufficient
                break;
            case 4:
                // move in random position if not already occupied by creature
                // todo: get random cell from free-cells-around-me-list
                this._x += this.getRnd(3) - 2;
                this._y += this.getRnd(3) - 2;
                this._energy -= (10 - this._stats.Movement);
                break;
            case 5:  // move food
                // move towards nearest food item.
                // if already next to a food item - dont move.
                break;
            case 6: // hunt
                // move towards nearest creature
                // if already next to a creature - dont move.
                break;
            case 7: // attack
                // attack all creatures in adjacent cells
                break;
            case 8: // eat
                // eat food of one adjacent cell if available.
                break;
        }

    }
}


// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

class Evolve {

    g: Graphics;

    constructor() {
        this.g = new Graphics("mainCanvas", 160, 100);
    };

    main() {

        var f = new Field(this.g);

        var c1 = new Creature(f);
        var c2 = new Creature(f);
        var c3 = new Creature(f);
        c1.x = 20;
        c1.y = 20;
        c2.x = 21;
        c2.y = 21;
        c3.x = 19;
        c3.y = 20;
        f.addFood(16, 16, 5);
        f.addFood(34, 31, 1);
        f.addFood(66, 74, 8);
        f.addFood(99, 99, 4);
        f.addCreature(c1);
        f.addCreature(c2);
        f.addCreature(c3);
        f.draw();
        console.log(f.getNearbyFreeCells(21, 22));

    };


}

var e = new Evolve();

e.main();
