import { Coord } from "./coord.js";
import { Graphics } from "./graphics.js";
import {Creature} from "./creature.js";

export class Field {
    private _g: Graphics;
    private _creatures: Creature[];
    private _food: number[][];
    private _foodcolor = ["#ffffff", "#ddffcc", "#bbff99", "#99ff66", "#77ff33", "55ff00", "#44cc00", "#339900", "#226600", "#113300"]

    // Offsets for all 8 cells around a coordinate
    private _around = [
        new Coord(-1,-1), new Coord(0,-1), new Coord(1,-1), 
        new Coord(-1, 0),                  new Coord(1, 0), 
        new Coord(-1, 1), new Coord(0, 1), new Coord(1, 1), 
    ]

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

    public isFree(cellCoord: Coord): boolean {
        if (!this.isValidCoord(cellCoord)) return false;
        return !this._creatures.find(element => element.pos.isEqual(cellCoord) )
    }

    public isValidCoord(cellCoord:Coord): boolean {
        return((cellCoord.x>=0 && cellCoord.x<this.g.xres)&&(cellCoord.y>=0 && cellCoord.y<this.g.yres))
    }

    // gets a list of nearby creatures
    public getNearbyCreatures(cellCoord: Coord): Creature[] {
        return this._creatures.filter(element => element.pos.isAround(cellCoord));
    }

    // Returns the coord of the nearest food item
    public getNearestFoodCoord(cellCoord: Coord): Coord {
        var result: Coord = null;
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
    public getNearbyFreeCells(cellCoord: Coord): Coord[] {
        var result: Array<Coord> = [];
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
        this._around.forEach(crd => {if (this.isFree(crd)) result.push(crd);})
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
                    this._g.box(new Coord(i, j));
                }
            }
        }

        // Draw creatures
        this._creatures.forEach(element => element.draw());
    }
}
