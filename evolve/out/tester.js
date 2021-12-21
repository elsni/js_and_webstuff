export class Tester {
    constructor(testName) {
        this._count = 0;
        this.print("---------------------------------");
        this.print("Test : " + testName);
        this.print("---------------------------------");
    }
    testName(txt) {
        this._count++;
        if (!txt) {
            return `Test ${this._count}:`;
        }
        else {
            return `Test ${txt}:`;
        }
    }
    expectNum(a, b, txt) {
        if (a === b) {
            this.print(`${this.testName(txt)} ok`);
        }
        else {
            this.print(`${this.testName(txt)} ERROR: expected ${a} - got ${b}`);
        }
    }
    expectTrue(a, txt) {
        if (a) {
            this.print(`${this.testName(txt)} ok`);
        }
        else {
            this.print(`${this.testName(txt)} ERROR: expected TRUE - got FALSE`);
        }
    }
    expectFalse(a, txt) {
        if (!a) {
            this.print(`${this.testName(txt)} ok`);
        }
        else {
            this.print(`${this.testName(txt)} ERROR: expected FALSE - got TRUE`);
        }
    }
    expectCoordInArray(a, b, txt) {
        var result = false;
        a.forEach(c => { if (c.isEqual(b))
            result = true; });
        if (result) {
            this.print(`${this.testName(txt)} ok`);
        }
        else {
            this.print(`${this.testName(txt)} ERROR: expected ${b} to be in ${a}`);
        }
    }
    expectCoordNotInArray(a, b, txt) {
        var result = false;
        a.forEach(c => { if (c.isEqual(b))
            result = true; });
        if (!result) {
            this.print(`${this.testName(txt)} ok`);
        }
        else {
            this.print(`${this.testName(txt)} ERROR: expected ${b.toString()} NOT to be in ${a}`);
        }
    }
    expectCoordEitherOr(a, either, or, txt) {
        if (a.isEqual(either) || a.isEqual(or)) {
            this.print(`${this.testName(txt)} ok`);
        }
        else {
            this.print(`${this.testName(txt)} ERROR: expected either ${either.toString()} or ${or.toString()} - got ${a.toString()}`);
        }
    }
    print(t) {
        document.getElementById("testout").innerHTML += t + "<br />";
    }
}
