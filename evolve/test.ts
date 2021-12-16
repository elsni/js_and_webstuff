

import { Graphics } from "./graphics.js";
import { Field } from "./field.js";
import { Creature } from "./creature.js";
import { Coord } from "./coord.js";


class Test {

    g: Graphics;

    constructor() {
        this.g = new Graphics("mainCanvas", 160, 100);
    };

    expectNum(a:number, b:number) {
        if (a===b) {
            console.log("ok");
        }
        else {
            console.log(`ERROR: expected ${a} - got ${b}`)
        }
    }

    testField() {
        var f = new Field(this.g);

        var c1 = new Creature(f);
        c1.pos = new Coord(10,10);
        f.addCreature(c1);
        var c2 = new Creature(f);
        c2.pos = new Coord(12,10);
        f.addCreature(c2);
        var c3 = new Creature(f);
        c3.pos = new Coord(11,13);
        f.addCreature(c3);
        f.draw();
        this.expectNum(f.getNearbyCreatures(new Coord(11,11)).length,2);
        //console.log(f.getNearbyCreatures(new Coord(11,11)));

    }
    main() {

        this.testField();


    };


}

var e = new Test();

e.main();
