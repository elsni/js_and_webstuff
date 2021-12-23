import { Coord } from "./coord.js";
import { toolbox } from "./toolbox.js";
;
export class Creature {
    // --------------------------------------------------------------
    // Creates a Creature on Pos 0,0
    // If a Creature is given, the result will be a random mutation
    // if mutation=true.
    // With no parameters the creature will be random
    constructor(parent, mutate) {
        // stat points are constant to (num of stat values) *5. If one stat is raised, one other is lowered.
        // the higher, the better for all stats
        this._stats = {
            Attack: 5,
            Defense: 5,
            Poison: 5,
            Harvest: 5,
            Movement: 5,
            Reproduction: 5,
            Production: 5,
            Digestion: 5,
            Consumption: 5 // (P) amount of Energy every tick costs (10-value) /4
        };
        // 1 Food Item = 20 if digestion = 10. with digestion=5 its 10.
        // 1 Move cost 10-Movement energy points
        this._lifespan = 100; // lifespan cycles
        this._age = 0; // age of cycles
        this._progmem = 5; // Number of instructions program memory
        this._pc = 0; // Program counter
        this._energy = 100; // Amount of energy
        this._reproEnergy = 40; // Amount of Energy needed for reproduction
        this._productionEnergy = 30; // Amount of Energy needed for production
        this._progbuff = new Array(this._progmem);
        this._color = "#ffffff";
        this._hidden = false;
        this._dead = false;
        this.instructions = [
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
            this._energy = parent._energy;
            this._progmem = parent.progmem;
            this._color = parent.color;
            this._id = parent.id;
            this._reproEnergy = parent.reproEnergy;
            this._productionEnergy = parent.productionEnergy;
            if (mutate) {
                this.mutate();
            }
        }
        else {
            this._pos = new Coord(0, 0);
            this.randomize();
        }
        ;
    }
    get id() { return this._id; }
    set id(value) { this._id = value; }
    get reproEnergy() { return this._reproEnergy; }
    set reproEnergy(value) { this._reproEnergy = value; }
    get productionEnergy() { return this._productionEnergy; }
    set productionEnergy(value) { this._productionEnergy = value; }
    get lifespan() { return this._lifespan; }
    set lifespan(value) { this._lifespan = value; }
    get age() { return this._age; }
    set age(value) { this._age = value; }
    get progmem() { return this._progmem; }
    set progmem(value) { this._progmem = value; }
    get pc() { return this._pc; }
    set pc(value) { this._pc = value; }
    get energy() { return this._energy; }
    set energy(value) { this._energy = value; }
    get progbuff() { return this._progbuff; }
    set progbuff(value) { this._progbuff = value; }
    get color() { return this._color; }
    set color(value) { this._color = value; }
    get field() { return this._field; }
    set field(value) { this._field = value; }
    get pos() { return this._pos; }
    set pos(value) { this._pos = value; }
    get stats() { return this._stats; }
    set stats(value) { this._stats = value; }
    get hidden() { return this._hidden; }
    set hidden(value) { this._hidden = value; }
    get dead() { return this._dead; }
    set dead(value) { this._dead = value; }
    // --------------------------------------------------------------
    randomize() {
        this._progmem = toolbox.getRandomInt(1, 10);
        this._progbuff = new Array(this._progmem);
        // randomize programm
        for (var i = 0; i < this._progmem; i++) {
            this._progbuff[i] = toolbox.getRandomInt(0, this.instructions.length - 1);
        }
        // shuffle Stats
        for (i = 0; i <= 50; i++) {
            this.alterStats();
        }
        // randomize lifespan
        this._lifespan = toolbox.getRandomInt(10, 50);
        this._reproEnergy = toolbox.getRandomInt(10, 100);
        this._productionEnergy = toolbox.getRandomInt(10, 100);
        this.calculateColor();
        this.createID();
    }
    // --------------------------------------------------------------
    // Change stats. sub 1 from one stat and add it to another
    alterStats() {
        var keylist = Object.keys(this._stats);
        var numberOfStats = keylist.length;
        var a = 0, b = 0;
        var va = 0, vb = 0;
        do {
            do {
                a = toolbox.getRandomInt(0, numberOfStats - 1);
                b = toolbox.getRandomInt(0, numberOfStats - 1);
            } while (a === b);
            va = this._stats[keylist[a]] + 1;
            vb = this._stats[keylist[b]] - 1;
        } while (va < 0 || va > 9 || vb < 0 || vb > 9);
        this._stats[keylist[a]] = va;
        this._stats[keylist[b]] = vb;
    }
    // --------------------------------------------------------------
    reproduce() {
        var childpos = this._field.findNearestFreeCell(this._pos);
        // chreate mutated child
        var child = new Creature(this, true);
        // share energy
        child.energy = Math.min(40, Math.floor(this._energy / 2));
        this._energy = this.energy / 2;
        child.field = this._field;
        child.pos = childpos;
        this._field.addCreature(child);
        //this.field.updateCreature(this);
    }
    // --------------------------------------------------------------
    mutate() {
        // always change stats slightly
        this.alterStats();
        // sometimes alter lifespan
        if (toolbox.getRandomInt(1, 3) == 1) {
            this._lifespan += toolbox.getRandomInt(-5, 5);
            if (this._lifespan < 20)
                this._lifespan = 20;
            if (this._lifespan > 100)
                this._lifespan = 100;
        }
        // sometimes alter reproEnergy
        if (toolbox.getRandomInt(1, 3) == 1) {
            this._reproEnergy += toolbox.getRandomInt(-2, 2);
            if (this._reproEnergy < 10)
                this._reproEnergy = 10;
            if (this._reproEnergy > 80)
                this._reproEnergy = 80;
        }
        // sometimes alter productionEnergy
        if (toolbox.getRandomInt(1, 3) == 1) {
            this._productionEnergy += toolbox.getRandomInt(-2, 2);
            if (this._productionEnergy < 10)
                this._productionEnergy = 10;
            if (this._productionEnergy > 80)
                this._productionEnergy = 80;
        }
        // rarely change program size
        if (toolbox.getRandomInt(1, 10) == 1) {
            var oldpgm = this._progmem;
            this._progmem += toolbox.getRandomInt(-1, 1);
            if (this._progmem < 1) {
                this._progmem = 1;
            }
            // if progmem gets bigger, push one random instruction to widen the array
            if (this._progmem > oldpgm) {
                this._progbuff.push(toolbox.getRandomInt(0, this.instructions.length - 1));
            }
            if (this._pc >= this._progmem)
                this._pc = 0;
        }
        // sometimes change one program instruction to a random one
        if (toolbox.getRandomInt(1, 5) == 1) {
            var instidx = toolbox.getRandomInt(0, this._progmem - 1);
            this._progbuff[instidx] = toolbox.getRandomInt(0, this.instructions.length - 1);
        }
        this.calculateColor();
        this.createID();
    }
    // --------------------------------------------------------------
    print() {
        this.printStats();
        this.printProgMem();
    }
    createID() {
        var id = this._stats.Attack.toString() +
            this._stats.Defense.toString() +
            this._stats.Poison.toString() +
            this._stats.Harvest.toString() +
            this._stats.Movement.toString() +
            this._stats.Reproduction.toString() +
            this._stats.Production.toString() +
            this._stats.Digestion.toString() +
            this._stats.Consumption.toString() +
            this._lifespan.toString() +
            this._progmem.toString();
        for (var i = 0; i < this._progmem; i++) {
            id += this._progbuff[i].toString();
        }
        this._id = id;
    }
    // --------------------------------------------------------------
    calculateColor() {
        var predator = 0;
        var herbivore = 0;
        var plant = 0;
        predator = this._stats.Attack + this._stats.Movement;
        plant = this._stats.Harvest + this._stats.Production + this._stats.Poison;
        herbivore = this._stats.Defense + this._stats.Movement;
        for (var i = 0; i < this._progmem; i++) {
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
        if (predator > 20)
            predator = 20;
        if (plant > 30)
            plant = 30;
        if (herbivore > 20)
            herbivore = 20;
        this._color = "#" + (Math.floor(255 / 20 * predator)).toString(16) + (Math.floor(255 / 30 * plant)).toString(16) + (Math.floor(255 / 30 * herbivore)).toString(16);
    }
    // --------------------------------------------------------------
    printStats() {
        console.log("-------------------------");
        console.log(this._id);
        console.log("Pos (x,y)...:" + this._pos.toString());
        console.log("Color.......:" + this._color);
        console.log("Energy......:" + this._energy);
        console.log("Age.........:" + this._age);
        console.log("Lifespan....:" + this._lifespan);
        console.log("ReproEnergy.:" + this._reproEnergy);
        console.log("ProdEnergy..:" + this._productionEnergy);
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
    hasField() {
        if (!this._field) {
            console.log("set field first");
            return false;
        }
        return true;
    }
    // --------------------------------------------------------------
    printProgMem() {
        console.log("PC..........:" + this._pc);
        console.log("Progmem.....:" + this._progmem);
        for (var i = 0; i < this._progmem; i++) {
            console.log(toolbox.zeroPad(i, 2) + ": " + this.instructions[this._progbuff[i]]);
        }
    }
    // --------------------------------------------------------------
    draw() {
        if (!this.hasField)
            return;
        this._field.g.color(this._color);
        if (this._hidden) {
            this._field.g.box(this._pos);
        }
        else {
            this._field.g.plot(this._pos);
        }
    }
    // --------------------------------------------------------------
    moveToRandomFreeCell() {
        if (!this.hasField)
            return;
        var freecells = this.field.getNearbyFreeCells(this._pos);
        // dont move if there is no free cell
        if (freecells.length > 0) {
            var idx = toolbox.getRandomInt(0, freecells.length - 1);
            this._field.move(this.pos, freecells[idx]);
            this._pos = freecells[idx];
            this._energy -= (10 - this._stats.Movement);
        }
    }
    // --------------------------------------------------------------
    fleeFromCreature() {
        if (!this.hasField)
            return;
        // only flee if creature is nearby
        var nearbycreatures = this._field.getNearbyCreatures(this._pos);
        // flee only when a creature is nearby
        if (nearbycreatures.length > 0) {
            // Get list of free cells
            var freecells = this._field.getNearbyFreeCells(this._pos);
            var oldlength = nearbycreatures.length;
            var dest = null;
            // find field with less creatures in reach
            this._hidden = true;
            freecells.forEach(coord => {
                var nc = this._field.getNearbyCreatures(coord);
                if (nc.length < oldlength) {
                    oldlength = nc.length;
                    dest = coord;
                }
            });
            this._hidden = false;
            // if we found one with less creatures, go there, otherwise stay and pray for mercy
            if (dest != null) {
                this._field.move(this.pos, dest);
                this._pos = dest;
                this._energy -= (10 - this._stats.Movement);
            }
        }
    }
    // --------------------------------------------------------------
    die() {
        this._color = "#000000";
        this._dead = true;
    }
    // --------------------------------------------------------------
    moveTowards(c) {
        if (c) {
            if (this.pos.isEqual(c) || this.pos.isNextTo(c))
                return;
            var np = new Coord(this.pos.x + Math.sign(c.x - this.pos.x), this.pos.y + Math.sign(c.y - this.pos.y));
            // don't move if the way is blocked
            if (this.field.isFree(np)) {
                this._field.move(this.pos, np);
                this.pos = np;
            }
        }
    }
    // --------------------------------------------------------------
    attack(cr) {
        var damage = Math.max(this._stats.Attack - cr.stats.Defense, 0);
        var damage_received = Math.max(cr.stats.Poison - this._stats.Defense, 0);
        cr.energy -= damage;
        this._energy -= damage_received;
        //this._field.updateCreature(this);
        //cr.field.updateCreature(cr);
    }
    // --------------------------------------------------------------
    tick() {
        if (!this.hasField)
            return;
        var instr = this._progbuff[this._pc];
        if (instr === undefined) {
            console.log("ERROR Instruction: (" + instr + ")" + this.instructions[instr]);
            this.printProgMem();
        }
        switch (instr) {
            case 0:
                //wait -  do nothing
                break;
            case 1: // harvest energy
                // harvest Energy according to efficiency
                this._energy += this._stats.Harvest / 4;
                break;
            case 2: // watch and flee
                // move to the field with the least creatures nearby if creature is near
                if (this._field.getNearbyCreatures(this._pos).length > 0) {
                    this.fleeFromCreature();
                }
                break;
            case 3: // produce
                // TODO
                if (this._energy >= this._productionEnergy) {
                    var foodpos = this._field.getRandomAdjacentCell(this._pos);
                    this._field.addFood(foodpos, 1);
                    this._energy -= (10 - this._stats.Production);
                }
                // produce food item in nearby field if energy level is sufficient
                break;
            case 4: // move Random
                // move in random position to a non occupied field
                this.moveToRandomFreeCell();
                this._energy -= (10 - this._stats.Movement) / 2;
                break;
            case 5: // move food
                // move towards nearest food item.
                // if already next to a food item - dont move.
                //console.log("alt: "+this.pos);
                var nearest = this._field.getNearestFoodCoord(this._pos);
                //console.log("food:"+nearest);
                this.moveTowards(nearest);
                //console.log("neu:"+this.pos);
                this._energy -= (10 - this._stats.Movement) / 2;
                break;
            case 6: // hunt
                // move towards nearest creature
                // if already next to a creature - dont move.
                this.moveTowards(this._field.getNearestCreatureCoord(this._pos));
                this._energy -= (10 - this._stats.Movement) / 2;
                break;
            case 7: // attack
                // attack one of the creatures in adjacent cells
                var creatures = this._field.getNearbyCreatures(this._pos);
                if (creatures.length > 0) {
                    var idx = toolbox.getRandomInt(0, (creatures.length - 1));
                    this.attack(creatures[idx]);
                }
                break;
            case 8: // eat
                var foodval = this._field.consumeBestFoodAround(this._pos);
                this._energy += foodval * this._stats.Digestion;
                // eat food of one adjacent cell if available.
                break;
        }
        if (!this._field.isValidCoord(this._pos)) {
            console.log("Invalid Coord!!!");
        }
        // advance program counter
        this._pc++;
        if (this._pc >= this._progmem)
            this._pc = 0;
        // subtract base energy consumption
        this._energy -= (10 - this._stats.Consumption);
        // reproduction
        if (this._age >= (10 - this._stats.Reproduction) * 10 && this._energy >= this._reproEnergy) {
            this.reproduce();
        }
        this._age++;
        // die of age or of low energy.
        if (this._age > this._lifespan || this._energy <= 0)
            this.die();
    }
}
