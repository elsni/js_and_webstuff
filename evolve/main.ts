class Graphics {

    canvasId: string;
    width: number;
    height: number;
    xres: number;
    yres: number;
    ctx: CanvasRenderingContext2D;
    xfact: number;
    yfact: number;

    constructor(canvasId: string, xres: number, yres: number) {
        var canvas = <HTMLCanvasElement>document.getElementById(canvasId);
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
    plot(x: number, y: number) {
        this.ctx.fillRect(x * this.xfact, y * this.yfact, this.xfact - 1, this.yfact - 1);
    }

    color(col: string) {
        this.ctx.fillStyle = col;
    }
}


class Cell {
    food: number = 0;
    creature: Creature = null;

    public isEmpty(): boolean {
        return this.creature == null;
    }

    public clearCreature() {
        this.creature = null;
    }
    public setCreature(c: Creature) {
        this.creature = c;
    }
    public clearFood() {
        this.food = 0;
    }
    public setFood(f: number) {
        this.food = f;
    }
}

class Field {
    private g: Graphics;
    private cells: Cell[][];

    constructor(g: Graphics) {
        this.g = g;

        for(var i: number = 0; i < g.xres; i++) {
            this.cells[i] = [];
            for(var j: number = 0; j< g.yres; j++) {
                this.cells[i][j] = new Cell();
            }
        }

    }
}

// --------------------------------------------------------------
class Creature {

    stats = {
        Attack: 5,                 // Attack efficiency in 0-10
        Defense: 5,                // Defense efficiency in 0-10
        Poison: 5,                 // Poisionous to attackers in 0-10
        Harvest: 5,                // Energy harvest efficiency in 0-10
        Movement: 5,               // Movement efficiency in 0-10
        Reproduction: 5,           // Reproduction efficiency in 0-10 (how many cycles until rep. in % of life cycles)
        Production: 5,             // Production efficiency in 0-10
        Digestion: 5,              // How much energy is gaines off one food item
        Consumption: 5             // Energy efficiency per tick
    }

    xmax: number;
    ymax: number;
    x: number;
    y: number;

    // 1 Food Item = 20 if digestion = 10. with digestion=5 its 10.
    // 1 Move cost 10-Movement energy points
    lifespan: number = 100;     // lifespan cycles
    age: number = 0;            // age of cycles
    progmem: number = 5;        // Number of instructions program memory
    pc: number = 0;               // Program counter
    energy: number = 100;        // Amount of energy
    progbuff: Array<number> = new Array(this.progmem);
    color: string = "#ffffff";

    instructions: Array<string> = [
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

    constructor(xmax: number, ymax: number, parent?: Creature, mutate?: boolean) {
        this.xmax = xmax;
        this.ymax = ymax;

        if (typeof parent !== 'undefined') {

            this.progbuff = [...parent.progbuff];
            this.stats.Attack = parent.stats.Attack;
            this.stats.Defense = parent.stats.Defense;
            this.stats.Poison = parent.stats.Poison;
            this.stats.Harvest = parent.stats.Harvest;
            this.stats.Movement = parent.stats.Movement;
            this.stats.Reproduction = parent.stats.Reproduction;
            this.stats.Production = parent.stats.Production;
            this.stats.Digestion = parent.stats.Digestion;
            this.stats.Consumption = parent.stats.Consumption;
            this.age = 0;
            this.lifespan = parent.lifespan;
            this.energy = Math.floor(parent.energy / 2);

            if (mutate) {
                this.mutate();
            }

        } else {
            this.randomize();
        };
    }

    // --------------------------------------------------------------
    randomize() {

        this.x = this.getRnd(this.xmax);
        this.y = this.getRnd(this.ymax);
        this.progmem = this.getRnd(10);
        this.progbuff = new Array(this.progmem);

        // randomize programm
        for (var i: number = 0; i < this.progmem; i++) {
            this.progbuff[i] = this.getRnd(this.instructions.length);
        }

        // shuffle Stats
        for (i = 0; i <= 50; i++) {
            this.alterStats();
        }

        // randomize lifespan
        this.lifespan = this.getRnd(200) + 20;

        this.calculateColor();
    }

    // --------------------------------------------------------------
    // Change stats. sub 1 from one stat and add it to another
    alterStats() {
        var keys = Object.keys(this.stats)
        var num = keys.length;
        var a = 0, b = 0;
        var va = 0, vb = 0;
        do {
            do {
                a = this.getRnd(num);
                b = this.getRnd(num);
            } while (a === b);
            va = this.stats[keys[a]] + 1;
            vb = this.stats[keys[b]] - 1;

        } while (va < 0 || va > 10 || vb < 0 || vb > 10)

        this.stats[keys[a]] = va;
        this.stats[keys[b]] = vb;
    }

    // --------------------------------------------------------------
    getRnd(max: number): number {
        return Math.floor(Math.random() * max);
    }

    // --------------------------------------------------------------
    mutate() {

        // always change stats slightly
        this.alterStats();

        // sometimes alter lifespan
        if (this.getRnd(3) == 1) {
            this.lifespan += this.getRnd(11) - 5;
            if (this.lifespan < 20) this.lifespan = 20;
            if (this.lifespan > 300) this.lifespan = 300;
        }
        // rarely change program size
        if (this.getRnd(10) == 2) {
            var oldpgm = this.progmem;
            this.progmem += this.getRnd(3) - 1;

            // if progmem gets bigger, push one random instruction to widen the array
            if (this.progmem > oldpgm) {
                this.progbuff.push(this.getRnd(this.instructions.length));
            }
        }

        // sometimes change one program instruction to a random one
        if (this.getRnd(5) == 1) {
            var instidx = this.getRnd(this.progmem);
            this.progbuff[instidx] = this.getRnd(this.instructions.length);
        }

    }

    public print() {
        this.printStats();
        this.printProgMem();
    }

    // --------------------------------------------------------------
    calculateColor() {
        var predator = 0;
        var herbivore = 0;
        var plant = 0;

        predator = this.stats.Attack + this.stats.Movement;
        plant = this.stats.Harvest + this.stats.Production + this.stats.Poison;
        herbivore = this.stats.Defense + this.stats.Movement;

        for (var i: number = 0; i < this.progmem; i++) {
            switch (this.progbuff[i]) {
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
        this.color = "#" + (Math.floor(255 / 20 * predator)).toString(16) + (Math.floor(255 / 30 * plant)).toString(16) + (Math.floor(255 / 30 * herbivore)).toString(16);

    }
    // --------------------------------------------------------------
    printStats() {
        console.log("Pos (x,y)...:" + this.x + "," + this.y);
        console.log("Color.......:" + this.color);
        console.log("Energy......:" + this.energy);
        console.log("Age.........:" + this.age);
        console.log("Lifespan....:" + this.lifespan);
        console.log("-------------------------");
        console.log("Attack......:" + this.stats.Attack);
        console.log("Defense.....:" + this.stats.Defense);
        console.log("Poison......:" + this.stats.Poison);
        console.log("Harvest.....:" + this.stats.Harvest);
        console.log("Movement....:" + this.stats.Movement);
        console.log("Reproduction:" + this.stats.Reproduction);
        console.log("Production..:" + this.stats.Production);
        console.log("Digestion...:" + this.stats.Digestion);
        console.log("Consumption.:" + this.stats.Consumption);
        console.log("-------------------------");
    }

    // --------------------------------------------------------------
    printProgMem() {
        console.log("Progmem.....:" + this.progmem);
        for (var i: number = 0; i < this.progmem; i++) {
            console.log(this.instructions[this.progbuff[i]]);
        }
    }

    // --------------------------------------------------------------
    tick() {
        var instr = this.progbuff[this.pc];
        this.pc++;
        if (this.pc == this.progmem) this.pc = 0;

        switch (instr) {
            case 0:
                //wait -  do nothing
                break;
            case 1:
                // harvest Energy according to efficiency
                this.energy += this.stats.Harvest;
                break;
            case 2:
                // move in opposite direction if another creature is nearby
                break;
            case 3:
                // produce food item in nearby field if energy level is sufficient
                break;
            case 4:
                // move in random position if not already occupied by creature
                // todo: get random cell from free-cells-around-me-list
                this.x += this.getRnd(3) - 2;
                this.y += this.getRnd(3) - 2;
                this.energy -= (10 - this.stats.Movement);
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
        this.g.clear();
        this.g.color("#ff0000");
        this.g.plot(21, 20);

        var c = new Creature(160, 100);
        c.print();

    };


}

var e = new Evolve();

e.main();
