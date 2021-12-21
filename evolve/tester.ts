import { Coord } from "./coord.js";

export class Tester {

    private _count=0;

    constructor(testName:string) {
        this.print("---------------------------------");
        this.print("Test : "+testName);
        this.print("---------------------------------");
    }

    private testName(txt?:string):string {
        this._count++;
        if(!txt) {
            return `Test ${this._count}:`
        }
        else {
            return `Test ${txt}:`;
        }
    }

    public expectNum(a:number, b:number,txt?:string) {
        if (a===b) {
            this.print(`${this.testName(txt)} ok`);
        }
        else {
            this.print(`${this.testName(txt)} ERROR: expected ${a} - got ${b}`)
        }
    }

    public expectTrue(a:boolean, txt?:string) {
        if (a) {
            this.print(`${this.testName(txt)} ok`);
        }
        else {
            this.print(`${this.testName(txt)} ERROR: expected TRUE - got FALSE`)
        }
    }

    
    public expectFalse(a:boolean, txt?:string) {
        if (!a) {
            this.print(`${this.testName(txt)} ok`);
        }
        else {
            this.print(`${this.testName(txt)} ERROR: expected FALSE - got TRUE`)
        }
    }

    public expectCoordInArray(a:Coord[], b:Coord, txt?:string) {
        var result=false;
        a.forEach(c=>{if(c.isEqual(b)) result = true;})
        if(result) {
            this.print(`${this.testName(txt)} ok`);
        } 
        else {
            this.print(`${this.testName(txt)} ERROR: expected ${b} to be in ${a}`)
        }
    }

    public expectCoordNotInArray(a:Coord[], b:Coord, txt?:string) {
        var result=false;
        a.forEach(c=>{if(c.isEqual(b)) result = true;})
        if(!result) {
            this.print(`${this.testName(txt)} ok`);
        } 
        else {
            this.print(`${this.testName(txt)} ERROR: expected ${b.toString()} NOT to be in ${a}`)
        }
    }

    public expectCoordEitherOr(a:Coord, either:Coord, or:Coord, txt?:string) {
        if (a.isEqual(either) || a.isEqual(or)) {
            this.print(`${this.testName(txt)} ok`);
        }
        else {
            this.print(`${this.testName(txt)} ERROR: expected either ${either.toString()} or ${or.toString()} - got ${a.toString()}`)
        }
    }

    public print(t:string) {
        document.getElementById("testout").innerHTML +=t+"<br />";
    }

}