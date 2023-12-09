// import { Path } from 'paper';
import { TopoPath } from "../drawing/paperjs";

const DEBUG_GREEN = "#10FF0C";
const RED_MARK = "#CE2D4F";
const GUIDES = "#06E7EF";

export function isEven(n: any) {
    return n == parseFloat(n) ? !(n % 2) : void 0;
}

export function isOdd(n: any) {
    return n == parseFloat(n) ? n % 2 : void 0;
}

export function radToDeg(rad: number) {
    return rad * (180.0 / Math.PI);
}

export function degToRad(deg: number) {
    return deg * (Math.PI / 180.0);
}

export function to360(deg: number) {
    //converts from paper system (-180 to 180 ) to ( 0 to 360 )

    var value;

    if (deg <= 0) {
        value = deg * -1;
    } else {
        value = 360 - deg;
    }

    return value; //( ((deg-180)*-1)-360 )*-1
}

export function to180(deg: number) {
    //converts from paper system (-180 to 180 ) to ( 0 to 360 )

    var value;

    if (deg <= 180) {
        value = deg * -1;
    } else {
        value = 360 - deg;
    }

    return value; //( ((deg-180)*-1)-360 )*-1
}

export function genRandomDec(min: number, max: number) {
    return min + (max - min) * Math.random();
}

export function genRandom(min: number, max: number) {
    return (min + (max - min + 1) * Math.random()) | 0;
}

export function normalize(val: number, min: number, max: number) {
    return (val - min) / (max - min);
}
