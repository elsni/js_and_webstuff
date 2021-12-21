import { Coord } from "./coord.js";
import { Graphics } from "./graphics.js";
import { Creature } from "./creature.js";
import { Food } from "./food.js";
import { toolbox } from "./toolbox.js";

export class Field {
    private _g: Graphics;
    private _creatures: Creature[];
    //private _food: number[][];
    private _food: Food[];


    // Offsets for all 8 cells around a coordinate
    private _around = [
        new Coord(-1, -1), new Coord(0, -1), new Coord(1, -1),
        new Coord(-1, 0), new Coord(1, 0),
        new Coord(-1, 1), new Coord(0, 1), new Coord(1, 1),
    ]

    public get g(): Graphics {
        return this._g;
    }

    // ---------------------------------------------------------------------------------------------
    constructor(g: Graphics) {
        this._creatures = [];
        this._food = [];
        this._g = g;
    }

    // ---------------------------------------------------------------------------------------------
    // Checks if a cell is free (no creature there)
    public isFree(cellCoord: Coord): boolean {
        if (!this.isValidCoord(cellCoord)) return false;
        return !this._creatures.find(element => (element.pos.isEqual(cellCoord) && !element.hidden));
    }

    // ---------------------------------------------------------------------------------------------
    // check if a coordinate is within the field boundaries
    public isValidCoord(cellCoord: Coord): boolean {
        return ((cellCoord.x >= 0 && cellCoord.x < this.g.xres) && (cellCoord.y >= 0 && cellCoord.y < this.g.yres))
    }

    // ---------------------------------------------------------------------------------------------
    // return a random free cell within field boundaries
    public getRandomFreeCell() {
        var result: Coord
        do {
            result = Coord.getRandom(this._g.xres-1, this._g.yres-1);
        } while (!this.isFree(result));
        return result;
    }

    // ---------------------------------------------------------------------------------------------
    // Return amount of food in one cell
    public getFood(pos: Coord): Food {
        var result: Food;
        var temp = this._food.filter(function (element) {
            return (element.pos.isEqual(pos));
        });
        if (temp.length > 0) {
            result = temp[0];
        }
        else {
            result = new Food(pos, 0);
        }
        return result;
    }

    // ---------------------------------------------------------------------------------------------
    // return a list of all creatures
    public get Creatures(): Creature[] {
        return this._creatures;
    }

    // ---------------------------------------------------------------------------------------------
    // return the coordinates of a random valid cell next to a given cell
    public getRandomAdjacentCell(cellCoord: Coord): Coord {
        var result: Coord;
        do {
            var idx = toolbox.getRandomInt(0, 7);
            var cellOff = Coord.aroundOffsets[idx];
            result = cellCoord.offset(cellOff);
        }
        while (!this.isValidCoord(result))
        return result;
    }

    // ---------------------------------------------------------------------------------------------
    // return a list of creatures next to a given cell
    public getNearbyCreatures(cellCoord: Coord): Creature[] {
        return this._creatures.filter(function (element) {
            return (element.pos.isNextTo(cellCoord) && !element.hidden);
        });
    }

    // ---------------------------------------------------------------------------------------------
    // Return the coord of the nearest food item
    public getNearestFoodCoord(cellCoord: Coord): Coord {
        var result: Coord;
        var distance = 1000000;
        this._food.forEach(fd => {
            var dist = Math.sqrt(Math.abs(cellCoord.x - fd.pos.x) ** 2 + Math.abs(cellCoord.y - fd.pos.y) ** 2);
            if (dist < distance && fd.amount > 0) {
                distance = dist;
                result = fd.pos;
            }
        });
        return result;
    }

    // ---------------------------------------------------------------------------------------------
    // return coordinates of the nearest creature
    public getNearestCreatureCoord(cellCoord: Coord): Coord {
        var result: Coord;
        var distance = 1000000;
        this._creatures.forEach(cr => {
            var dist = Math.sqrt(Math.abs(cellCoord.x - cr.pos.x) ** 2 + Math.abs(cellCoord.y - cr.pos.y) ** 2);
            if (dist < distance) {
                distance = dist;
                result = cr.pos;
            }
        });
        return result;
    }

    // ---------------------------------------------------------------------------------------------
    // return all free (no creature there) cells around a coordinate
    public getNearbyFreeCells(cellCoord: Coord): Coord[] {
        var result: Array<Coord> = [];
        Coord.aroundOffsets.forEach(crd => { if (this.isFree(cellCoord.offset(crd))) result.push(cellCoord.offset(crd)); })
        return result;
    }


    // ---------------------------------------------------------------------------------------------
    // look for the food item with highest value in adjacent cells, remove it and return its value
    public consumeBestFoodAround(cellCoord: Coord): number {
        var result: number = 0;
        var resultcoord: Coord;
        Coord.aroundOffsets.forEach(off => {
            var p = cellCoord.offset(off);
            var f = this.getFood(p);
            if (f.amount > result) {
                resultcoord = p;
                result = f.amount;
            }
        })
        this.consumeFood(resultcoord);
        return result;
    }

    // ---------------------------------------------------------------------------------------------
    // removes a food item (set its amout to zero) and return its old amount;
    public consumeFood(pos: Coord): number {
        var result = 0;
        for (var i = 0; i < this._food.length; i++) {
            if (this._food[i].pos.isEqual(pos)) {
                result = this._food[i].amount;
                this._food[i].amount = 0;
                return result;
            }
        }
        return result;

    }
    // ---------------------------------------------------------------------------------------------
    // add food to a given cell
    public addFood(pos: Coord, amount: number) {
        var found = false;
        for (var i = 0; i < this._food.length; i++) {
            if (this._food[i].pos.isEqual(pos)) {
                this._food[i].amount += amount;
                found = true;
            }
        }
        if (!found) {
            this._food.push(new Food(pos, amount));
        }
    }

    // ---------------------------------------------------------------------------------------------
    // put a given or random Creature to the field if the cell is free.
    // if the cell is not free, put it to a random free position on the field
    public addCreature(c?: Creature,) {
        var cr: Creature;
        if (c) {
            c.field = this;
            cr = c;
        } else {
            cr = new Creature();
            cr.pos = this.getRandomFreeCell();
        };
        if (this.isFree(cr.pos)) {
            this._creatures.push(cr);
        }
    }

    // ---------------------------------------------------------------------------------------------
    // draw the whole field, food and creatures.
    public draw() {
        // Draw food
        this._g.clear();

        this._food.forEach(element => element.draw(this));

        // Draw creatures
        this._creatures.forEach(element => element.draw());
    }
}
