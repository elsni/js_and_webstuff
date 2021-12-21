import { Coord } from "./coord.js";
import { Field } from "./field.js";
import {toolbox} from "./toolbox.js";

interface Stat {
    Attack: number,
    Defense: number,
    Poison: number,
    Harvest: number,
    Movement: number,
    Reproduction: number,
    Production: number,
    Digestion: number,
    Consumption: number
};

export class Creature {

    // stat points are constant to (num of stat values) *5. If one stat is raised, one other is lowered.
    // the higher, the better for all stats
    private _stats: Stat = {
        Attack: 5,          // (A) Maximum amount of damage an attack command can cause
        Defense: 5,         // (P) Maximum amount of defense. Damage = attack value - defense value
        Poison: 5,          // (P) If a creature is poisonous, an attacker receives damage like a counter-attack
        Harvest: 5,         // (A) amount of energy, a harvest command creates
        Movement: 5,        // (A) Amount of energy a movement step costs (10-Movement)
        Reproduction: 5,    // (P) (10-value) *5 = Creature becomes adult and can reproduce if enough energy
        Production: 5,      // (A) it takes 10-value energy to produce a food item in a random adjacent cell
        Digestion: 5,       // (P) one food gives 5+(2 * Digestion)
        Consumption: 5      // (P) amount of Energy every tick costs (10-value) /4
    };

    private _pos: Coord;
    private _field: Field;
    // 1 Food Item = 20 if digestion = 10. with digestion=5 its 10.
    // 1 Move cost 10-Movement energy points
    private _lifespan: number = 100;     // lifespan cycles
    private _age: number = 0;            // age of cycles
    private _progmem: number = 5;        // Number of instructions program memory
    private _pc: number = 0;             // Program counter
    private _energy: number = 100;       // Amount of energy
    private _reproEnergy = 40            // Amount of Energy needed for reproduction
    private _productionEnergy = 30       // Amount of Energy needed for production
    private _progbuff: Array<number> = new Array(this._progmem);
    private _color: string = "#ffffff";
    private _hidden = false;
    private _dead= false;           

    public get lifespan(): number {return this._lifespan;}
    public set lifespan(value: number) {this._lifespan = value;}
    
    public get age(): number {return this._age;}
    public set age(value: number) {this._age = value;}
    
    public get progmem(): number {return this._progmem;}
    public set progmem(value: number) {this._progmem = value; }
    
    public get pc(): number { return this._pc;}
    public set pc(value: number) {this._pc = value;}
    
    public get energy(): number {return this._energy; }
    public set energy(value: number) {this._energy = value;}
    
    public get progbuff(): Array<number> {return this._progbuff;}
    public set progbuff(value: Array<number>) {this._progbuff = value;}

    public get color(): string {return this._color;}
    public set color(value: string) {this._color = value;}

    public get field(): Field { return this._field; }
    public set field(value: Field) { this._field = value; }

    public get pos(): Coord { return this._pos; }
    public set pos(value: Coord) { this._pos = value; }

    public get stats():Stat { return this._stats; }
    public set stats(value: Stat) { this._stats = value; }

    public get hidden() { return this._hidden; }
    public set hidden(value) { this._hidden = value; }

    public get dead() { return this._dead; }
    public set dead(value) { this._dead = value; }


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
    // Creates a Creature on Pos 0,0
    // If a Creature is given, the result will be a random mutation
    // otherwise a completely random Creature
    constructor(parent?: Creature, mutate?: boolean) {
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
            this._pos = new Coord(0,0);
            this.randomize();
        };
    }

    // --------------------------------------------------------------
    private randomize() {
        this._progmem = toolbox.getRandomInt(1,10);
        this._progbuff = new Array(this._progmem);

        // randomize programm
        for (var i: number = 0; i < this._progmem; i++) {
            this._progbuff[i] = toolbox.getRandomInt(0,this.instructions.length-1);
        }

        // shuffle Stats
        for (i = 0; i <= 50; i++) {
            this.alterStats();
        }

        // randomize lifespan
        this._lifespan = toolbox.getRandomInt(20,300);

        this.calculateColor();
    }

    // --------------------------------------------------------------
    // Change stats. sub 1 from one stat and add it to another
    public alterStats() {
        var keys = Object.keys(this._stats)
        var num = keys.length;
        var a = 0, b = 0;
        var va = 0, vb = 0;
        do {
            do {
                a = toolbox.getRandomInt(0,num-1);
                b = toolbox.getRandomInt(0,num-1);
            } while (a === b);
            va = this._stats[keys[a]] + 1;
            vb = this._stats[keys[b]] - 1;

        } while (va < 0 || va > 10 || vb < 0 || vb > 10)

        this._stats[keys[a]] = va;
        this._stats[keys[b]] = vb;
    }

    // --------------------------------------------------------------
    private reproduce() {
        var childpos = this._field.getRandomAdjacentFreeCell(this._pos);

        // chreate mutated child
        var child = new Creature(this,true);

        // share energy
        child.energy = Math.floor(this._energy/2);
        this._energy-=child.energy;

        child.field = this._field;
        child.pos = childpos;
        this._field.addCreature(child);
        //this.field.updateCreature(this);
    }

    // --------------------------------------------------------------
    private mutate() {

        // always change stats slightly
        this.alterStats();

        // sometimes alter lifespan
        if (toolbox.getRandomInt(1,3) == 1) {
            this._lifespan += toolbox.getRandomInt(-5,5);
            if (this._lifespan < 20) this._lifespan = 20;
            if (this._lifespan > 300) this._lifespan = 300;
        }

        // sometimes alter lifespan
        if (toolbox.getRandomInt(1,3) == 1) {
            this._reproEnergy += toolbox.getRandomInt(-2,2);
            if (this._reproEnergy < 10) this._reproEnergy = 10;
            if (this._reproEnergy > 80) this._reproEnergy = 80;
        }
        // rarely change program size
        if (toolbox.getRandomInt(1,10) == 1) {
            var oldpgm = this._progmem;
            this._progmem += toolbox.getRandomInt(-1,1);

            // if progmem gets bigger, push one random instruction to widen the array
            if (this._progmem > oldpgm) {
                this._progbuff.push(toolbox.getRandomInt(0,this.instructions.length-1));
            }
            if(this._pc>=this._progmem) this._pc=0;
        }

        // sometimes change one program instruction to a random one
        if (toolbox.getRandomInt(1,5) == 1) {
            var instidx = toolbox.getRandomInt(0,this._progmem-1);
            this._progbuff[instidx] = toolbox.getRandomInt(0,this.instructions.length-1);
        }

        this.calculateColor();

    }
    // --------------------------------------------------------------

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
        console.log("Pos (x,y)...:" + this._pos.toString());
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

    private hasField() {
        if (!this._field) {
            console.log("set field first");
            return false;
        }
        return true;
    }

    // --------------------------------------------------------------
    public printProgMem() {
        console.log("Progmem.....:" + this._progmem);
        for (var i: number = 0; i < this._progmem; i++) {
            console.log(this.instructions[this._progbuff[i]]);
        }
    }
    // --------------------------------------------------------------
    public draw() {
        if (!this.hasField) return;
        this._field.g.color(this._color);
        if (this._hidden) {
            this._field.g.box(this._pos);
        }else {
            this._field.g.plot(this._pos);
        }
    }

    // --------------------------------------------------------------

    public moveToRandomFreeCell() {
        if (!this.hasField) return;
        var freecells = this.field.getNearbyFreeCells(this._pos);
        if (freecells.length > 0) {
            var idx = toolbox.getRandomInt(0,freecells.length-1);
            this._pos = freecells[idx];
            this._energy -= (10 - this._stats.Movement);
        }
    }

    // --------------------------------------------------------------

    public fleeFromCreature() {
        if (!this.hasField) return;
        // only flee if creature is nearby
        var nearbycreatures = this._field.getNearbyCreatures(this._pos);
        // flee only when a creature is nearby
        if (nearbycreatures.length > 0) {
            // Get list of free cells
            var freecells = this._field.getNearbyFreeCells(this._pos);
            var oldlength = nearbycreatures.length;
            var dest = null;
            // find field with less creatures in reach
            this._hidden=true;
            freecells.forEach(coord => {
                var nc = this._field.getNearbyCreatures(coord);
                if (nc.length < oldlength) {
                    oldlength=nc.length;
                    dest = coord;
                }
            });
            this._hidden= false;
            // if we found one with less creatures, go there, otherwise stay and pray for mercy
            if (dest != null) {
                this._pos = dest;
                this._energy -= (10 - this._stats.Movement);
            }
        }
    }
    // --------------------------------------------------------------
    public die() {
        this._color="#000000";
        this._dead=true;
    }
    // --------------------------------------------------------------

    public moveTowards(c:Coord) {
        if (c) {
        console.log("move towards "+c);
        if (this.pos.isEqual(c) || this.pos.isNextTo(c)) return;
        var dx= Math.abs(this.pos.x-c.x)
        var dy= Math.abs(this.pos.y-c.y)
        if(dy>dx) {
            this.pos.y++;
        }
        else {
            this.pos.x++;
        }
    }
    }

    // --------------------------------------------------------------
    public attack(cr:Creature) {
        var damage = Math.max(this._stats.Attack - cr.stats.Defense,0);
        var damage_received = Math.max(cr.stats.Poison - this._stats.Defense,0);
        cr.energy -= damage;
        this._energy -= damage_received;
        //this._field.updateCreature(this);
        //cr.field.updateCreature(cr);
    }

    // --------------------------------------------------------------
    tick() {
        if(!this.hasField) return;
        var instr = this._progbuff[this._pc];
        console.log("Instruction: ("+instr+")"+this.instructions[instr]);
        switch (instr) {
            case 0:
                //wait -  do nothing
                break;
            case 1: // harvest energy
                // harvest Energy according to efficiency
                this._energy += this._stats.Harvest;
                break;
            case 2: // watch and flee
                // move to the field with the least creatures nearby if creature is near
                if (this._field.getNearbyCreatures(this._pos).length > 0) {
                    this.fleeFromCreature();
                }
                break;
            case 3:  // produce
                // TODO
                if (this._energy >= this._productionEnergy) {
                    var foodpos = this._field.getRandomAdjacentCell(this._pos);
                    this._field.addFood(foodpos,1);
                    this._energy -= (10-this._stats.Production);
                }
                // produce food item in nearby field if energy level is sufficient
                break;
            case 4:  // move Random
                // move in random position to a non occupied field
                this.moveToRandomFreeCell();
                this._energy -= (10 - this._stats.Movement);

                break;
            case 5:  // move food
                // move towards nearest food item.
                // if already next to a food item - dont move.
                this.moveTowards(this._field.getNearestFoodCoord(this._pos));
                this._energy -= (10 - this._stats.Movement);

                break;
            case 6: // hunt
                // move towards nearest creature
                // if already next to a creature - dont move.
                this.moveTowards(this._field.getNearestCreatureCoord(this._pos));
                this._energy -= (10 - this._stats.Movement);

                break;
            case 7: // attack
                // attack one of the creatures in adjacent cells
                var creatures = this._field.getNearbyCreatures(this._pos);
                if (creatures.length > 0) {
                    var idx = toolbox.getRandomInt(0,(creatures.length-1));
                    this.attack(creatures[idx]);
                }
                break;
            case 8: // eat
                var foodval = this._field.consumeBestFoodAround(this._pos);
                this._energy += foodval *(5+2*this._stats.Digestion);
                // eat food of one adjacent cell if available.
                break;
        }

        // advance program counter
        this._pc++;
        if (this._pc >= this._progmem) this._pc = 0;
        // subtract base energy consumption
        this._energy -= (10-this._stats.Consumption)/4;
        if (this._age>=(10-this._stats.Reproduction)*5 && this._energy >= this._reproEnergy) {
            this.reproduce();
        }

        this._age++;
        // die of age or of low energy.
        if (this._age > this._lifespan || this._energy<=0 ) this.die();

    }
}
