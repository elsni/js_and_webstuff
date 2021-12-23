import { Graphics } from "./graphics.js";
import { Field } from "./field.js";
import { Coord } from "./coord.js";


class Evolve {

    private _g: Graphics;
    private _f: Field;

    private _run = false;
    private _intervalId;
    constructor() {
        this.init();
    };

    init() {
        this._g = new Graphics("mainCanvas", 160, 100);
        this._f = new Field(this._g,100);
        for (var i = 0; i < 100; i++) {
            this._f.addCreature();
        }

        document.addEventListener('keypress', (event) => {
            var name = event.key;
            var code = event.code;
            console.log(this._run);
            if (this._run) {
                clearTimeout(this._intervalId);
                this._run = false;
            }
            else {
                var t = this;
                this._intervalId = setTimeout(function () {
                    t.loop();
                }, 100);
                this._run = true;
            }

        }, false);

        this._g.setMouseEventHandler(ev => this.click(ev));
 
    };

    loop() {
        this._f.tick();
        this._f.draw();
        var t = this;
        this._intervalId =setTimeout(function () {
            t.loop();
        }, 100);

    };

    click(c: Coord) {
        var cr = this._f.getCreature(c);
        var fd = this._f.getFood(c);
        if (cr) {
            cr.print();
        }
        if (fd) {
            fd.print();
        }
    };

    main() {
    };

}

var e = new Evolve();

e.main();
