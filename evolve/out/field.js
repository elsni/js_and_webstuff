import { Coord } from "./coord.js";
import { Creature } from "./creature.js";
import { Food } from "./food.js";
export class Field {
    // ---------------------------------------------------------------------------------------------
    constructor(g) {
        // Offsets for all 8 cells around a coordinate
        this._around = [
            new Coord(-1, -1), new Coord(0, -1), new Coord(1, -1),
            new Coord(-1, 0), new Coord(1, 0),
            new Coord(-1, 1), new Coord(0, 1), new Coord(1, 1),
        ];
        this._creatures = [];
        this._food = [];
        this._g = g;
        /*
        for (var i: number = 0; i < g.xres; i++) {
            this._food[i] = [];
            for (var j: number = 0; j < g.yres; j++) {
                this._food[i][j] = 0;
            }
        }
        */
    }
    get g() {
        return this._g;
    }
    // ---------------------------------------------------------------------------------------------
    isFree(cellCoord) {
        if (!this.isValidCoord(cellCoord))
            return false;
        return !this._creatures.find(element => (element.pos.isEqual(cellCoord) && !element.hidden));
    }
    // ---------------------------------------------------------------------------------------------
    isValidCoord(cellCoord) {
        return ((cellCoord.x >= 0 && cellCoord.x < this.g.xres) && (cellCoord.y >= 0 && cellCoord.y < this.g.yres));
    }
    // ---------------------------------------------------------------------------------------------
    getRandomFreeCell() {
        var result;
        do {
            result = Coord.getRandom(this._g.xres, this._g.yres);
        } while (!this.isFree(result));
        return result;
    }
    // ---------------------------------------------------------------------------------------------
    // Return amount of food in one cell
    getFood(pos) {
        var result;
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
    get Creatures() {
        return this._creatures;
    }
    // ---------------------------------------------------------------------------------------------
    // gets a list of nearby creatures
    getNearbyCreatures(cellCoord) {
        return this._creatures.filter(function (element) {
            return (element.pos.isNextTo(cellCoord) && !element.hidden);
        });
    }
    // ---------------------------------------------------------------------------------------------
    // Returns the coord of the nearest food item
    getNearestFoodCoord(cellCoord) {
        var result;
        var distance = 1000000;
        this._food.forEach(fd => {
            var dist = Math.sqrt(Math.pow(Math.abs(cellCoord.x - fd.pos.x), 2) + Math.pow(Math.abs(cellCoord.y - fd.pos.y), 2));
            if (dist < distance && fd.amount > 0) {
                distance = dist;
                result = fd.pos;
            }
        });
        return result;
    }
    // ---------------------------------------------------------------------------------------------
    // Get coordinates of the nearest creature
    getNearestCreatureCoord(cellCoord) {
        var result;
        var distance = 1000000;
        this._creatures.forEach(cr => {
            var dist = Math.sqrt(Math.pow(Math.abs(cellCoord.x - cr.pos.x), 2) + Math.pow(Math.abs(cellCoord.y - cr.pos.y), 2));
            if (dist < distance) {
                distance = dist;
                result = cr.pos;
            }
        });
        return result;
    }
    // ---------------------------------------------------------------------------------------------
    // gets all free (no creature there) cells around a coordinate
    getNearbyFreeCells(cellCoord) {
        var result = [];
        Coord.aroundOffsets.forEach(crd => { if (this.isFree(cellCoord.offset(crd)))
            result.push(cellCoord.offset(crd)); });
        return result;
    }
    // ---------------------------------------------------------------------------------------------
    // look for the food item with highest value in adjacent cells, remove it and return its value
    consumeBestFoodAround(cellCoord) {
        var result = 0;
        var resultcoord;
        Coord.aroundOffsets.forEach(off => {
            var p = cellCoord.offset(off);
            var f = this.getFood(p);
            if (f.amount > result) {
                resultcoord = p;
                result = f.amount;
            }
        });
        this.consumeFood(resultcoord);
        return result;
    }
    // ---------------------------------------------------------------------------------------------
    // removes a food item (set its amout to zero) and return its old amount;
    consumeFood(pos) {
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
    addFood(pos, amount) {
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
    // add a given or random Creature to the field if the cell is free.
    addCreature(c) {
        var cr;
        if (c) {
            c.field = this;
            cr = c;
        }
        else {
            cr = new Creature();
            cr.pos = this.getRandomFreeCell();
        }
        ;
        if (this.isFree(cr.pos)) {
            this._creatures.push(cr);
        }
    }
    // ---------------------------------------------------------------------------------------------
    // draw the whole field, food and creatures.
    draw() {
        // Draw food
        this._g.clear();
        this._food.forEach(element => element.draw(this));
        // Draw creatures
        this._creatures.forEach(element => element.draw());
    }
}
