

import { Graphics } from "./graphics.js";
import { Field } from "./field.js";
import { Creature } from "./creature.js";
import { Coord } from "./coord.js";
import { Tester } from "./tester.js";

class Test {

    g: Graphics;

    constructor() {
        this.g = new Graphics("mainCanvas", 20, 20);
    };

    testCoord() {
        var t = new Tester("Coord");
        var c1 = new Coord(10,10);
        var c2 = new Coord(10,10);
        var c3 = new Coord(11,10);
        var c4 = new Coord(12,11);
        var c5 = new Coord(12,15);
        t.expectTrue(c1.isEqual(c2),"isEqual 1");
        t.expectFalse(c1.isEqual(c3),"isEqual 2");
        t.expectTrue(c1.isNextTo(c3),"isNextTo 1");
        t.expectTrue(c3.isNextTo(c1),"isNextTo 2");
        t.expectFalse(c1.isNextTo(c2),"isNextTo 3");
        t.expectFalse(c1.isNextTo(c4),"isNextTo 4");
        t.expectTrue(c5.isEqual(c3.offset(new Coord(1,5))),"offset 1");
        t.expectTrue(c1.isEqual(c5.offset(new Coord(-2,-5))),"offset 2");
    }

    testFieldCreature() {
        var c1010 = new Coord(10,10)
        var c1110 = new Coord(11,10)
        var c1111 = new Coord(11,11)
        var c1210 = new Coord(12,10)
        var c1113 = new Coord(11,13)
        var c1515 = new Coord(15,15)


        var f = new Field(this.g);
        var c1 = new Creature();
        c1.pos = c1010;
        f.addCreature(c1);
        var c2 = new Creature();
        c2.pos = c1210;
        f.addCreature(c2);
        var c3 = new Creature();
        c3.pos = c1110;
        f.addCreature(c3);
        var c4 = new Creature();
        c4.pos = c1515;
        f.addCreature(c4);
        f.draw();

        var t = new Tester("Field (Creatures)");
        var cr1 = f.getNearbyCreatures(c1111);
        t.expectNum(3, cr1.length,"getNearbyCreatures 1");
        var cr2 = f.getNearbyCreatures(new Coord(10,9));
        t.expectNum(2, cr2.length,"getNearbyCreatures 2");

        t.expectCoordEitherOr(c1010,cr2[0].pos,cr2[1].pos,"getNearbyCreatures 3")
        t.expectCoordEitherOr(c1110,cr2[0].pos,cr2[1].pos,"getNearbyCreatures 4")
        t.expectTrue(f.isFree(c1111),"isFree 1");
        t.expectFalse(f.isFree(c1010),"isFree 2");
        t.expectTrue(f.isValidCoord(c1010),"isValidCoord 1");
        t.expectFalse(f.isValidCoord(new Coord(10,100)),"isValidCoord 2");
        t.expectFalse(f.isValidCoord(new Coord(-1,10)), "isValidCoord 3");
        var fc = f.getNearbyFreeCells(c1111);
        t.expectCoordInArray(fc,new Coord(10,11),"getNearbyFreeCells 1");
        t.expectCoordInArray(fc,new Coord(11,12),"getNearbyFreeCells 2");
        t.expectCoordNotInArray(fc,c1111,"getNearbyFreeCells 3");
        t.expectCoordNotInArray(fc,c1010,"getNearbyFreeCells 4");
        t.expectCoordNotInArray(fc,c1210,"getNearbyFreeCells 5");
    }
    
    testFieldFood() {
        var f = new Field(this.g);
        var t = new Tester("Field (Food)");
        var c1919 = new Coord(19,19);
        var c0101 = new Coord(1,1);
        var c1017 = new Coord(10,17);
        var c0509 = new Coord(5,9);
        var c1010 = new Coord(10,10)
        var c1110 = new Coord(11,10)
        var c1111 = new Coord(11,11)
        var c1210 = new Coord(12,10)
        var c1113 = new Coord(11,13)
        var c1515 = new Coord(15,15)
        f.addFood(c1919,10);
        f.addFood(c0101,5);
        f.draw();
        t.expectTrue((typeof f.getFood(c1919))==="object","GetFood 1");
        t.expectNum(10,f.getFood(c1919).amount,"GetFood 2");
        t.expectTrue(f.getNearestFoodCoord(c1111).isEqual(c1919),"getNearestFoodCoord 1");
        t.expectTrue(f.getNearestFoodCoord(c1113).isEqual(c1919),"getNearestFoodCoord 2");
        t.expectTrue(f.getNearestFoodCoord(c0509).isEqual(c0101),"getNearestFoodCoord 3");

        t.expectNum(5,f.consumeFood(c0101),"consumeFood 1");
        t.expectNum(0,f.consumeFood(c0101),"consumeFood 2");
        t.expectNum(0,f.consumeFood(c1111),"consumeFood 3");
        t.expectNum(10,f.consumeFood(c1919),"consumeFood 4");
        f.draw();
        f.addFood(c1010,3);
        f.addFood(c1110,5);
        f.addFood(c1210,2);
        f.addFood(c1113,7);
        t.expectNum(5,f.consumeBestFoodAround(c1111),"consumeBestFoodAround 1");
        t.expectNum(0,f.consumeFood(c1110),"consumeBestFoodAround 2");
        t.expectNum(3,f.consumeBestFoodAround(c1111),"consumeBestFoodAround 3");
        t.expectNum(2,f.consumeBestFoodAround(c1111),"consumeBestFoodAround 4");
        f.draw();
    }

    testCreature() {
        var c1010 = new Coord(10,10)
        var c1111 = new Coord(11,11)
        var c1110 = new Coord(11,10)
        var c1210 = new Coord(12,10)
        var c1113 = new Coord(11,13)
        
        var t = new Tester("Creature");
        var f = new Field(this.g);
        var c1 = new Creature();
        c1.pos = c1010;
        f.addCreature(c1);
        var c2 = new Creature();
        c2.pos = c1210;
        f.addCreature(c2);
        var c3 = new Creature();
        c3.pos = c1110;
        f.addCreature(c3);
        f.draw();
        var oldpos = c3.pos;
        c3.fleeFromCreature();
        t.expectFalse(c3.pos.isEqual(oldpos),"fleeFromCreature 1")
        f.draw();
        oldpos = c3.pos;
        c3.fleeFromCreature();
        t.expectFalse(c3.pos.isEqual(oldpos),"fleeFromCreature 2")
        f.draw();
        oldpos = c3.pos;
        c3.fleeFromCreature();
        t.expectTrue(c3.pos.isEqual(oldpos),"fleeFromCreature 3")
        f.draw();
        oldpos = c3.pos;
        c3.moveToRandomFreeCell();
        t.expectFalse(c3.pos.isEqual(oldpos),"MoveToRandomFreeCell 1")
        t.expectTrue(c3.pos.isNextTo(oldpos),"MoveToRandomFreeCell 2")
        f.draw();
    }




    main() {
        this.testCoord();
        this.testCreature();
        this.testFieldCreature();
        this.testFieldFood();
    };


}

var e = new Test();

e.main();
