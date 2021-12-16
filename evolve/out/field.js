import { Coord } from "./coord.js";
import { Creature } from "./creature.js";
export class Field {
    constructor(g) {
        this._foodcolor = ["#ffffff", "#ddffcc", "#bbff99", "#99ff66", "#77ff33", "55ff00", "#44cc00", "#339900", "#226600", "#113300"];
        // Offsets for all 8 cells around a coordinate
        this._around = [
            new Coord(-1, -1), new Coord(0, -1), new Coord(1, -1),
            new Coord(-1, 0), new Coord(1, 0),
            new Coord(-1, 1), new Coord(0, 1), new Coord(1, 1),
        ];
        this._creatures = [];
        this._food = [];
        this._g = g;
        for (var i = 0; i < g.xres; i++) {
            this._food[i] = [];
            for (var j = 0; j < g.yres; j++) {
                this._food[i][j] = 0;
            }
        }
    }
    get g() {
        return this._g;
    }
    isFree(cellCoord) {
        if (!this.isValidCoord(cellCoord))
            return false;
        return !this._creatures.find(element => element.pos.isEqual(cellCoord));
    }
    isValidCoord(cellCoord) {
        return ((cellCoord.x >= 0 && cellCoord.x < this.g.xres) && (cellCoord.y >= 0 && cellCoord.y < this.g.yres));
    }
    // gets a list of nearby creatures
    getNearbyCreatures(cellCoord) {
        return this._creatures.filter(element => element.pos.isAround(cellCoord));
    }
    // Returns the coord of the nearest food item
    getNearestFoodCoord(cellCoord) {
        var result = null;
        var distance = 1000;
        for (var i = 0; i < this._g.xres; i++) {
            for (var j = 0; j < this._g.yres; j++) {
                if (this._food[i][j] > 0) {
                    var didx = Math.sqrt(Math.abs(cellCoord.x - i) ^ 2 + Math.abs(cellCoord.y - j) ^ 2);
                    if (didx < distance) {
                        distance = didx;
                        result = new Coord(i, j);
                    }
                }
            }
        }
        return result;
    }
    // gets all free cells around a coordinate
    getNearbyFreeCells(cellCoord) {
        var result = [];
        /*
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
        */
        this._around.forEach(crd => { if (this.isFree(crd))
            result.push(crd); });
        return result;
    }
    addFood(x, y, amount) {
        this._food[x][y] += amount;
    }
    addCreature(c) {
        if (c) {
            c.field = this;
            this._creatures.push(c);
        }
        else {
            this._creatures.push(new Creature(this));
        }
        ;
    }
    draw() {
        // Draw food
        for (var i = 0; i < this._g.xres; i++) {
            for (var j = 0; j < this._g.yres; j++) {
                var food = Math.min(this._food[i][j], 9);
                if (food > 0) {
                    console.log("food at " + i + "," + j + " amount:" + food);
                    // the more food, the darker
                    this._g.color(this._foodcolor[food]);
                    this._g.box(new Coord(i, j));
                }
            }
        }
        // Draw creatures
        this._creatures.forEach(element => element.draw());
    }
}
