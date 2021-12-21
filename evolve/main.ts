import { Graphics } from "./graphics.js";
import { Field } from "./field.js";


class Evolve {

    private _g: Graphics;
    private _f: Field;


    constructor() {
        this.init();
    };

    init() {
        this._g = new Graphics("mainCanvas", 160, 100);
        this._f = new Field(this._g);
        for (var i = 0; i <= 10; i++) {
            this._f.addCreature();
        }
    };
    
    loop() {
        console.log("loop");
        this._f.tick();
        this._f.draw();

    };

    main() {
        var t=this;
        console.log("main");
        setInterval(function() {
            console.log("interval");
            t.loop();
        }, 200);
    };

}

var e = new Evolve();

e.main();
