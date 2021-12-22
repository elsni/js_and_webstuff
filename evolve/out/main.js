import { Graphics } from "./graphics.js";
import { Field } from "./field.js";
class Evolve {
    constructor() {
        this._run = false;
        this.init();
    }
    ;
    init() {
        this._g = new Graphics("mainCanvas", 160, 100);
        this._f = new Field(this._g);
        for (var i = 0; i <= 10; i++) {
            this._f.addCreature();
        }
        document.addEventListener('keypress', (event) => {
            var name = event.key;
            var code = event.code;
            console.log(this._run);
            if (this._run) {
                clearInterval(this._intervalId);
                this._run = false;
            }
            else {
                var t = this;
                this._intervalId = setInterval(function () {
                    t.loop();
                }, 500);
                this._run = true;
            }
        }, false);
        this._g.setMouseEventHandler(ev => this.click(ev));
    }
    ;
    loop() {
        this._f.tick();
        this._f.draw();
    }
    ;
    click(c) {
        var cr = this._f.getCreature(c);
        if (cr) {
            cr.print();
        }
    }
    ;
    main() {
    }
    ;
}
var e = new Evolve();
e.main();
