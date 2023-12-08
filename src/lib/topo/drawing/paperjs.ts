declare const paper: any;

import DisplayNode from "../core/displayNode";
import DisplayObject from "../core/displayObject";
import HyperPoint from "../core/hyperPoint";
import { IGroup, IHyperPoint, IPath, IPoint, PointLike, SizeLike } from "../types";

// -------------------------------------------------
// HELPERS

function isHyperPoint(obj: PointLike): obj is IHyperPoint {
    return "spin" in obj && "polarity" in obj;
}

function convertToPaperPoint(obj: PointLike): paper.Point {
    return new paper.Point(obj);
}

function convertToPoint(obj: PointLike): Point {
    return new Point(obj);
}

export function convertToHyperPoint(obj: PointLike | paper.Segment): IHyperPoint {

    const pt = "point" in obj ? obj.point : obj;
    
    const hIn = "handleIn" in obj && obj.handleIn ? obj.handleIn : null;
    const hOut = "handleOut" in obj && obj.handleOut ? obj.handleOut : null;

    const P = new HyperPoint(pt, hIn, hOut);
    P.spin = 1;

    if ( "location" in obj ) { 
        P.tangent = obj.location.tangent;
        P.normal = obj.location.normal;
    }

    return P as IHyperPoint;
}

function convertToPaperSegment(pt: PointLike): paper.Segment | paper.Point {
    if (isHyperPoint(pt)) {
        const hIn = pt.handleIn || null;
        const hOut = pt.handleOut || null;

        // console.log("1 IS HYPERPOINT ", hIn)
        // console.log("2 IS HYPERPOINT ", new paper.Segment(pt.point, hIn, hOut))

        return new paper.Segment(pt.point, hIn, hOut);
    } else {
        return new paper.Point(pt);
    }
}

export class Point {
    private _Point: Point;

    constructor(...args: any[]) {
        if (args.length === 0) {
            this._Point = new paper.Point();
            return this._Point;
        } else if (args.length === 1 && typeof args[0] === "object") {
            this._Point = new paper.Point(args[0]);
            return;
        } else {
            this._Point = new paper.Point(...args);
            return this._Point;
        }
    }

    get x(): number {
        return this._Point.x;
    }

    get y(): number {
        return this._Point.y;
    }

    set length(value: number) {
        this._Point.length;
    }

    get length(): number {
        return this._Point.length;
    }

    get angle(): number {
        return this._Point.angle;
    }

    get angleInRadians(): number {
        return this._Point.angleInRadians;
    }

    public clone(): Point {
        return this._Point;
    }

    public getDistance(point: PointLike, squared?: boolean): number {
        return this._Point.getDistance(point, squared);
    }

    public normalize(length?: number): Point {
        return this._Point.normalize(length);
    }

    public rotate(angle: number, center: PointLike): Point {
        return this._Point.rotate(angle, center);
    }

    public add(arg: PointLike | number): Point {
        return this._Point.add(arg);
    }

    public multiply(arg: PointLike | number): Point {
        return this._Point.multiply(arg);
    }

    public subtract(arg: PointLike | number): Point {
        return this._Point.subtract(arg);
    }

    public divide(arg: PointLike | number): Point {
        return this._Point.divide(arg);
    }

    public modulo(arg: PointLike | number): Point {
        return this._Point.modulo(arg);
    }
}

export class Segment {
    constructor(...args: any[]) {
        if (args.length === 0) {
            return new paper.Segment();
        } else if (args.length === 1 && typeof args[0] === "object") {
            return new paper.Segment(args[0]);
        } else {
            return new paper.Segment(...args);
        }
    }
}

export class TopoPath extends DisplayObject {
    private _Path: paper.Path;

    constructor(...args: any[]) {
        if (args.length === 0) {
            const paperPath = new paper.Path();
            // super(paperPath.position);
            super(paperPath.position);
            this.render(paperPath);
            this._Path = paperPath;
        } else if (args.length === 1 && typeof args[0] === "object") {
            const paperPath = new paper.Path(args[0]);
            // super(paperPath.position, paperPath.bounds.size);
            super(paperPath.position);
            this.render(paperPath);
            this._Path = paperPath;
        } else {
            const paperPath = new paper.Path(...args);
            // super(paperPath.position, paperPath.bounds.size);
            super(paperPath.position);
            this.render(paperPath);
            this._Path = paperPath;
        }
    }

    set fullySelected(value: boolean) {
        this._Path.fullySelected = value; 
    }

    get size(): SizeLike {
        return this._Path.bounds.size;
    }

    set position(value: PointLike) {
        this._Path.position = convertToPaperPoint(value);
    }

    get position(): PointLike {
        return this._Path.position;
    }

    set pivot(value: PointLike) {
        this._Path.pivot = convertToPaperPoint(value);
    }

    get pivot(): Point {
        return convertToPoint(this._Path.pivot);
    }

    get center(): PointLike {
        return this._Path.bounds.center;
    }

    get rotation(): number {
        return this._Path.rotation;
    }

    set rotation(value: number) {
        this._Path.rotation = value;
    }

    set strokeColor(value: paper.Color | null) {
        this._Path.strokeColor = value;
    }

    get strokeColor(): paper.Color | null {
        return this._Path.strokeColor;
    }

    set visibility(value: boolean) {
        this._Path.visible = value;
    }

    get visibility(): boolean {
        return this._Path.visible;
    }

    get length(): number {
        return this._Path.length;
    }

    get closed(): boolean {
        return this._Path.closed;
    }

    get segments(): IHyperPoint[] {
        return this._Path.segments.map( sgm => convertToHyperPoint(sgm) );
    }

    get firstPoint(): IHyperPoint {

        return convertToHyperPoint(this._Path.firstSegment);
    }

    get lastPoint(): IHyperPoint {

        return convertToHyperPoint(this._Path.lastSegment);
    }

    public addPoint( pt: IHyperPoint ) {

        const sgm = convertToPaperSegment(pt)

        // console.log("adding point: ", pt.handleOut)

        this._Path.add( sgm );
    }

    public add(...point: (IHyperPoint | PointLike | number[])[]) {

        this._Path.add(...point);
    }

    public insert(index: number, point: IHyperPoint | PointLike) {
        const segment = convertToPaperSegment(point) as PointLike;

        this._Path.insert(index, segment);
    }

    public reverse() {
        this._Path.reverse();
    }

    public getLocationAt(offset: number): paper.CurveLocation {
        return this._Path.getLocationAt(offset);
    }

    public getPointAt(offset: number): Point {
        return convertToPoint(this._Path.getPointAt(offset));
    }

    public scale(hor: number, ver: number, center?: PointLike) {

        this._Path.scale(hor, ver, center)
    }

    public rotate(angle: number, center?: PointLike) {

        this._Path.rotate(angle, center);
    }

    public clone(): TopoPath {
        // return this._Path.clone();
        const clonedPath = new TopoPath(this._Path.segments);
        clonedPath.strokeColor = this._Path.strokeColor;
        return clonedPath;
    }

    public reset(): void {
        this._Path.removeSegments();
    }

    public remove() {
        this._Path.remove();
    }
}

export class Circle {
    constructor(...args: any[]) {
        if (args.length === 0) {
            return new paper.Path.Circle();
        } else if (args.length === 1 && typeof args[0] === "object") {
            return new paper.Path.Circle(args[0]);
        } else {
            return new paper.Path.Circle(...args);
        }
    }
}

export class Ellipse extends TopoPath {
    constructor(...args: any[]) {
        super();
        if (args.length === 0) {
            return new paper.Path.Ellipse();
        } else if (args.length === 1 && typeof args[0] === "object") {
            return new paper.Path.Ellipse(args[0]);
        } else {
            return new paper.Path.Ellipse(...args);
        }
    }
}

export class Group extends DisplayNode {

    private _Group: paper.Group;

    constructor(...args: any[]) {
        if (args.length === 0) {
            const paperGroup = new paper.Path();
            super(paperGroup.position);
            this._Group = paperGroup;
        } else if (args.length === 1 && typeof args[0] === "object") {
            const paperGroup = new paper.Path(args[0]);
            super(paperGroup.position, paperGroup.bounds.size);
            this._Group = paperGroup;
        } else {
            const paperGroup = new paper.Path(...args);
            super(paperGroup.position, paperGroup.bounds.size);
            this._Group = paperGroup;
        }
    }

    set position(value: PointLike) {
        this._Group.position = convertToPaperPoint(value);
    }

    get position(): PointLike {
        return this._Group.position;
    }

    set pivot(value: PointLike) {
        this._Group.pivot = convertToPaperPoint(value);
    }

    get pivot(): Point {
        return convertToPoint(this._Group.pivot);
    }

    get size(): SizeLike {
        return this._Group.bounds.size;
    }

    set visibility(value: boolean) {
        this._Group.visible = value;
    }

    get visibility(): boolean {
        return this._Group.visible;
    }

    public addChild(item: DisplayObject) {
        // this._Group.addChild()
    }

    public rotate(angle: number, center?: PointLike) {

        this._Group.rotate(angle, center);
    }

    public remove() {
        this._Group.remove();
    }
}
