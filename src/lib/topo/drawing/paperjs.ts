import { Point, Path } from "paper";

import DisplayNode from "../core/displayNode";
import DisplayObject from "../core/displayObject";
import HyperPoint from "../core/hyperPoint";
import { IGroup, PointLike, SizeLike } from "../topo";

// -------------------------------------------------
// HELPERS

function isHyperPoint(obj: PointLike): obj is HyperPoint {
    return "spin" in obj && "polarity" in obj;
}

function convertToPaperPoint(obj: PointLike): paper.Point {
    return new paper.Point(obj);
}

function convertToPoint(obj: PointLike): paper.Point {
    return new Point(obj);
}

export function convertToHyperPoint(obj: PointLike | paper.Segment): HyperPoint {
    const pt = "point" in obj ? obj.point : obj;

    const hIn = "handleIn" in obj && obj.handleIn ? obj.handleIn : {x: 0, y: 0};
    const hOut = "handleOut" in obj && obj.handleOut ? obj.handleOut : {x: 0, y: 0};

    const P = new HyperPoint(pt, hIn, hOut);
    P.spin = 1;

    if ("location" in obj) {
        P.setTangent(new TopoPoint(obj.location.tangent));
        P.setNormal(new TopoPoint(obj.location.normal));
    }

    return P as HyperPoint;
}

function convertToPaperSegment(pt: PointLike): paper.Segment | paper.Point {
    if (isHyperPoint(pt)) {
        const hIn = pt.handleIn || null;
        const hOut = pt.handleOut || null;

        // console.log("1 IS HYPERPOINT ", hIn)
        // console.log("2 IS HYPERPOINT ", new paper.Segment(pt.point, hIn, hOut))

        return new paper.Segment(pt.point, hIn as PointLike, hOut as PointLike);
    } else {
        return new paper.Point(pt);
    }
}

export class TopoPoint {
    private _Point: paper.Point;

    constructor(...args: any[]) {
        if (args.length === 0) {
            this._Point = new Point(0, 0);
        } else if (args.length === 1 && typeof args[0] === "object") {
            this._Point = new Point(args[0]);
        } else {
            this._Point = new Point(args);
        }
    }

    get x(): number {
        return this._Point.x;
    }

    get y(): number {
        return this._Point.y;
    }

    set length(value: number) {
        this._Point.length = value;
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

    public clone(): TopoPoint {
        return new TopoPoint(this._Point);
    }

    public getDistance(point: PointLike, squared?: boolean): number {
        return this._Point.getDistance(point, squared);
    }

    public normalize(length?: number): TopoPoint {
        this._Point.normalize(length);
        return this;
    }

    public rotate(angle: number, center: PointLike): TopoPoint {
        this._Point.rotate(angle, center);
        return this;
    }

    public add(arg: PointLike | number): TopoPoint {
        if (typeof arg === 'number') {
            // If a number, add it to both x and y
            return new TopoPoint(this._Point.add({x: arg, y: arg}));
        } else if (Array.isArray(arg)) {
            // If a [number, number] tuple
            return new TopoPoint(this._Point.add({x: arg[0], y: arg[1]}));
        } else {
            return new TopoPoint(this._Point.add(arg));
        }
    }

    public multiply(arg: PointLike | number): TopoPoint {
        if (typeof arg === 'number') {
            // If a number, add it to both x and y
            return new TopoPoint(this._Point.multiply({x: arg, y: arg}));
        } else if (Array.isArray(arg)) {
            // If a [number, number] tuple
            return new TopoPoint(this._Point.multiply({x: arg[0], y: arg[1]}));
        } else {
            return new TopoPoint(this._Point.multiply(arg));
        }
    }

    public subtract(arg: PointLike | number): TopoPoint {
        if (typeof arg === 'number') {
            // If a number, add it to both x and y
            return new TopoPoint(this._Point.subtract({x: arg, y: arg}));
        } else if (Array.isArray(arg)) {
            // If a [number, number] tuple
            return new TopoPoint(this._Point.subtract({x: arg[0], y: arg[1]}));
        } else {
            return new TopoPoint(this._Point.subtract(arg));
        }
    }

    public divide(arg: PointLike | number): TopoPoint {
        if (typeof arg === 'number') {
            // If a number, add it to both x and y
            return new TopoPoint(this._Point.divide({x: arg, y: arg}));
        } else if (Array.isArray(arg)) {
            // If a [number, number] tuple
            return new TopoPoint(this._Point.divide({x: arg[0], y: arg[1]}));
        } else {
            return new TopoPoint(this._Point.divide(arg));
        }
    }

    public modulo(arg: PointLike | number): TopoPoint {
        if (typeof arg === 'number') {
            // If a number, add it to both x and y
            return new TopoPoint(this._Point.modulo({x: arg, y: arg}));
        } else if (Array.isArray(arg)) {
            // If a [number, number] tuple
            return new TopoPoint(this._Point.modulo({x: arg[0], y: arg[1]}));
        } else {
            return new TopoPoint(this._Point.modulo(arg));
        }
    }
}

export class TopoPath extends DisplayObject {

    protected _Path: paper.Path;

    constructor(...args: any[]) {
        if (args.length === 0) {
            const paperPath = new Path();
            // super(paperPath.position);
            super(paperPath.position);
            this._Path = paperPath;
        } else if (args.length === 1 && typeof args[0] === "object") {
            const paperPath = new Path(args[0]);
            // super(paperPath.position, paperPath.bounds.size);
            super(paperPath.position);
            this._Path = paperPath;
        } else {
            const paperPath = new Path(...args);
            // super(paperPath.position, paperPath.bounds.size);
            super(paperPath.position);
            this._Path = paperPath;
        }
        this.render(this);
    }

    // static Circle(center: PointLike, radius: number): TopoPath {

    //     const topo = new TopoPath();
    //     const path = new Path.Circle({center: center, radius: radius})
    //     topo._Path = path as paper.Path;
    //     topo.position = path.position;
    //     return topo;
    // }

    set fullySelected(value: boolean) {
        this._Path.fullySelected = value;
    }

    get fullySelected() {
        return this._Path.fullySelected;
    }

    get size() {
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

    get pivot(): paper.Point {
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

    set fillColor(value: paper.Color | null) {
        this._Path.fillColor = value;
    }

    get fillColor(): paper.Color | null {
        return this._Path.fillColor;
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

    set closed(value: boolean) {
        this._Path.closed = value;
    }

    get closed(): boolean {
        return this._Path.closed;
    }

    get points(): HyperPoint[] {
        return this._Path.segments.map((sgm) => convertToHyperPoint(sgm));
    }

    get firstPoint(): HyperPoint {
        return convertToHyperPoint(this._Path.firstSegment);
    }

    get lastPoint(): HyperPoint {
        return convertToHyperPoint(this._Path.lastSegment);
    }

    public createCircle(center: PointLike, radius: number) {
        const path = new Path.Circle({ center: center, radius: radius });
        this._Path = path;
        // this.position = center;
        this.placeAt(center);

        return this;
    }

    public addPoint(pt: HyperPoint) {
        const sgm = convertToPaperSegment(pt);

        // console.log("adding point: ", pt.handleOut)

        this._Path.add(sgm);
    }

    public add(...point: (HyperPoint | PointLike | number[])[]) {
        this._Path.add(...point);
    }

    public insert(index: number, point: HyperPoint | PointLike) {
        const segment = convertToPaperSegment(point) as PointLike;

        this._Path.insert(index, segment);
    }

    public reverse() {
        this._Path.reverse();
    }

    public getLocationAt(offset: number): any {
        const locationData = this._Path.getLocationAt(offset);
        const parsedLocationData = {
            point: new TopoPoint(locationData.point),
            tangent: new TopoPoint(locationData.tangent),
            normal: new TopoPoint(locationData.normal),
            curveLength: locationData.curve.length,
            pathLength: locationData.path.length
        };

        return parsedLocationData;
    }

    public getPointAt(offset: number): paper.Point {
        return convertToPoint(this._Path.getPointAt(offset));
    }

    public scale(hor: number, ver: number, center?: PointLike) {
        this._Path.scale(hor, ver, center);
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

    public getPaperPath(): paper.Path {
        return this._Path;
    }

}

export class TopoOrbital extends TopoPath {
    constructor(...args: any[]) {
        if (args.length === 1 && typeof args[0] === "object") {
            super();
            this._Path = new paper.Path.Circle(args[0]);
        } else {
            super();
            this._Path = new paper.Path.Circle(args);
        }
        super.render(this);
    }
}

export class Ellipse extends TopoPath {
    constructor(...args: any[]) {
        if (args.length === 1 && typeof args[0] === "object") {
            super();
            this._Path = new paper.Path.Ellipse(args[0]);
        } else {
            super();
            this._Path = new paper.Path.Ellipse(args);
        }
        this.render(this);
    }
}

export class Group extends DisplayNode {
    private _Group: paper.Group;

    constructor(...args: any[]) {
        if (args.length === 0) {
            const paperGroup = new paper.Group();
            super(paperGroup.position);
            this._Group = paperGroup;
        } else if (args.length === 1 && typeof args[0] === "object") {
            const paperGroup = new paper.Group(args[0]);
            super(paperGroup.position, paperGroup.bounds.size);
            this._Group = paperGroup;
        } else {
            const paperGroup = new paper.Group(...args);
            super(paperGroup.position, paperGroup.bounds.size);
            this._Group = paperGroup;
        }

        this.render(this);
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

    get pivot(): paper.Point {
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
