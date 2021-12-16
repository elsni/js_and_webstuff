

import { Graphics } from "./graphics.js";
import { Field } from "./field.js";


class Evolve {

    g: Graphics;

    constructor() {
        this.g = new Graphics("mainCanvas", 160, 100);
    };

    main() {

        var f = new Field(this.g);

        for (var i = 0; i <= 500; i++) {
            f.addCreature();
        }
        f.draw();

    };


}

var e = new Evolve();

e.main();
