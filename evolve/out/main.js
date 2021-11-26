class Graphics {
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
        this.ctx.fillRect(x * this.xfact, y * this.yfact, this.xfact - 1, this.yfact - 1);
    }
    color(col) {
        this.ctx.fillStyle = col;
    }
}
class Field {
}
// --------------------------------------------------------------
class Creature {
    // --------------------------------------------------------------
    constructor(xmax, ymax, parent, mutate) {
        this.stats = {
            Attack: 5,
            Defense: 5,
            Poison: 5,
            Harvest: 5,
            Movement: 5,
            Reproduction: 5,
            Production: 5,
            Digestion: 5,
            Consumption: 5 // Energy efficiency per tick
        };
        // 1 Food Item = 20 if digestion = 10. with digestion=5 its 10.
        // 1 Move cost 10-Movement energy points
        this.lifespan = 100; // lifespan cycles
        this.age = 0; // age of cycles
        this.progmem = 5; // Number of instructions program memory
        this.pc = 0; // Program counter
        this.energy = 100; // Amount of energy
        this.progbuff = new Array(this.progmem);
        this.color = "#ffffff";
        this.instructions = [
            "wait",
            "harvest",
            "watch",
            "produce",
            "move random",
            "move food",
            "hunt"
        ];
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
        }
        else {
            this.randomize();
        }
        ;
    }
    // --------------------------------------------------------------
    randomize() {
        this.x = this.getRnd(this.xmax);
        this.y = this.getRnd(this.ymax);
        this.progmem = this.getRnd(10);
        this.progbuff = new Array(this.progmem);
        // randomize programm
        for (var i = 0; i < this.progmem; i++) {
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
        var keys = Object.keys(this.stats);
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
        } while (va < 0 || va > 10 || vb < 0 || vb > 10);
        this.stats[keys[a]] = va;
        this.stats[keys[b]] = vb;
    }
    // --------------------------------------------------------------
    getRnd(max) {
        return Math.floor(Math.random() * max);
    }
    // --------------------------------------------------------------
    mutate() {
        // always change stats slightly
        this.alterStats();
        // sometimes alter lifespan
        if (this.getRnd(3) == 1) {
            this.lifespan += this.getRnd(11) - 5;
            if (this.lifespan < 20)
                this.lifespan = 20;
            if (this.lifespan > 300)
                this.lifespan = 300;
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
    print() {
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
        for (var i = 0; i < this.progmem; i++) {
            switch (this.progbuff[i]) {
                case 0:
                case 1:
                case 3:
                    plant++;
                    break;
                case 2:
                case 4:
                case 5:
                    herbivore++;
                    break;
                case 6:
                    predator++;
            }
        }
        if (predator > 20)
            predator = 20;
        if (plant > 30)
            plant = 30;
        if (herbivore > 20)
            herbivore = 20;
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
        for (var i = 0; i < this.progmem; i++) {
            console.log(this.instructions[this.progbuff[i]]);
        }
    }
    // --------------------------------------------------------------
    tick() {
        var instr = this.progbuff[this.pc];
        this.pc++;
        if (this.pc == this.progmem)
            this.pc = 0;
        switch (instr) {
            case 0: //wait
                break;
            case 1: // harvest
                this.energy += this.stats.Harvest;
                break;
            case 2: // watch
                break;
            case 3: // produce
                break;
            case 4: // move random
                this.x += this.getRnd(3) - 2;
                this.y += this.getRnd(3) - 2;
                this.energy -= (10 - this.stats.Movement);
                break;
            case 5: // move food
                break;
            case 6: // hunt
        }
    }
}
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
class Evolve {
    constructor() {
        this.g = new Graphics("mainCanvas", 160, 100);
    }
    ;
    main() {
        this.g.clear();
        this.g.color("#ff0000");
        this.g.plot(21, 20);
        var c = new Creature(160, 100);
        c.print();
    }
    ;
}
var e = new Evolve();
e.main();
