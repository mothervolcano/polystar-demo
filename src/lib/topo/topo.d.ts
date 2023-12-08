
export type PointLike =
  | IHyperPoint
  | [number, number]
  | { x: number; y: number }
  | { width: number; height: number }
  | { angle: number; length: number };

export type SizeLike = [number, number] | { x: number; y: number } | { width: number; height: number };

export type RectangleLike =
  | [number, number, number, number]
  | { x: number; y: number; width: number; height: number }
  | { from: PointLike; to: PointLike };

export type OrientationType = -1 | 1;
export type PolarityType = -1 | 1;

export type VectorDirection = "TAN" | "RAY" | "VER" | "HOR";

export type UnitIntervalNumber = number & { 0: number; 1: number };

// export type UnitIntervalNumber<T extends number = number> = T & { 0: number, 1: number };

export type BooleanLike = Boolean | 0 | 1;

export interface TopoLocationData {
  point: TopoPoint;
  tangent: TopoPoint;
  normal: TopoPoint;
  curveLength: number;
  pathLength: number;
  at: number;
}

declare class AttractorObject {

  readonly determineOrientation: Function;
  readonly determineSpin: Function;
  readonly determinePolarity: Function;

  constructor(topo: TopoPath, anchor?: HyperPoint);

  addAttractor(attractor: AttractorObject): AttractorObject;
  getAttractor(index: number): AttractorObject;
}

declare class AttractorTopo extends AttractorObject {}

declare class AttractorField extends AttractorObject {}

declare class OrbitalField extends AttractorField {}

declare class SpinalField extends AttractorField {}

declare class Spine extends AttractorTopo {}

declare class Orbital extends AttractorTopo {}

// export interface IAttractor {
//   topo: IPath;
//   field: any;
//   anchor: IHyperPoint;
//   spin: number;
//   polarity: number;
//   axisAngle: number;
//   axisLocked: boolean;
//   selfAnchored: boolean;
//   skip: boolean;
//   setField(aAttractorField: any): void;
//   setAnchor(aAnchor: IHyperPoint): void;
//   setAxisAngle(angle: number): void;
//   setSelfAnchored(value: boolean): void;
//   setAxisLocked(value: boolean): void;
//   setSkip(value: boolean): void;
//   setOrientationDeterminator(fn: Function);
//   setSpinDeterminator(fn: Function);
//   setPolarityDeterminator(fn: Function);

//   anchorAt(aAnchor: IHyperPoint, along?: VectorDirection): void;
//   update(): void;
//   adjustToPosition(): void;
//   adjustToSpin(): void;
//   adjustToPolarity(): void;
//   getTopoLocationAt(at: number): TopoLocationData;
//   addAttractor(aAttractor: IAttractor, at?: number): IAttractor;
//   getAttractor(i: number): IAttractor;
//   locate(at: number, orient?: boolean): IHyperPoint;
//   rotate(angle: number): void;
//   configureAttractor(): void;
// }

// export interface IAttractorTopo extends IAttractor {}

// export interface IAttractorField extends IAttractor {
//   setOrientationDeterminator(fn: Function);
//   setSpinDeterminator(fn: Function);
//   setPolarityDeterminator(fn: Function);
//   configureField(): void;
//   filterAttractors(): IAttractor[];
//   locateOn(iAttractor: number, at: number, orient?: boolean): IHyperPoint;
//   locateOn(iAttractor: number, at: number, orient: boolean = false): IHyperPoint;
// }

/**
 * Represents a hyperpoint in a drawing.
 *
 * A hyperpoint is a point extracted from a curve that serves as a guide for drawing.
 * It encapsulates the position, tangent, normal, and handles of the point.
 * The hyperpoint is primarily defined at the moment of extraction from the curve.
 *
 * The HyperPoint class provides methods to manipulate and transform the point along its tangent or normal vector.
 * It also allows setting the spin or orientation of the curve, as well as retrieving a segment object for creating or adding to a Path object.
 *
 * By retaining the tangent, normal, and other properties of the hyperpoint, it remains closely related to the underlying curve, enabling consistent modifications and adjustments to the drawing.
 */

declare class HyperPoint {
  readonly x: number;
  readonly y: number;
  readonly point: TopoPoint;

  handleIn: TopoPoint;
  handleOut: TopoPoint;
  position: number;
  spin: number;
  polarity: number;

  constructor(point: PointLike, handleIn?: PointLike, handleOut?: PointLike);

  setTangent(point: TopoPoint): void;
  getTangent(): TopoPoint
  setNormal(point: TopoPoint): void
  getNormal(): TopoPoint

  offsetBy(by: number, along: VectorDirection): HyperPoint;
  steer(tilt: number, aperture?: number, hScale?: number): HyperPoint;
  flip(): HyperPoint;
  clone(): HyperPoint;
}

declare class DisplayObject {
  isRendered: boolean;
  isRemoved: boolean;
  content: any;
  position: PointLike;
  x: number;
  y: number;
  size: SizeLike;
  width: number;
  height: number;

  constructor(position: PointLike, size?: SizeLike);

  placeAt(position: PointLike, pivot?: PointLike): void;
  remove(): void;
}

declare class TopoPoint {
  x: number;
  y: number;
  length: number;
  angle: number;
  angleInRadians: number;

  constructor(...args: any[]);

  clone(): TopoPoint;
  getDistance(point: PointLike, squared?: boolean): number;
  normalize(length?: number): TopoPoint;
  rotate(angle: number, center: PointLike): TopoPoint;
  add(arg: PointLike | number): TopoPoint;
  multiply(arg: PointLike | number): TopoPoint;
  subtract(arg: PointLike | number): TopoPoint;
  divide(arg: PointLike | number): TopoPoint;
  modulo(arg: PointLike | number): TopoPoint;
}

declare class TopoPath extends DisplayObject {
  fullySelected: boolean;
  size: SizeLike;
  position: PointLike;
  pivot: PointLike;
  center: PointLike;
  rotation: PointLike;
  strokeColor: paper.Color | null;
  visibility: boolean;
  length: number;
  closed: boolean;
  points: HyperPoint[];
  firstPoint: HyperPoint;
  lastPoint: HyperPoint;

  constructor(...args: any[]);

  addPoint(point: HyperPoint): void;
  add(...point: (IHyperPoint | PointLike | number[])[]): void;
  insert(index: number, point: HyperPoint | PointLike): void;
  reverse(): void;
  getLocationAt(offset: number): any;
  getPointAt(offset: number): paper.Point;
  scale(hor: number, ver: number, center?: PointLike): void;
  rotate(angle: number, center?: PointLike): void;
  clone(): TopoPath
  reset(): void;
  remove(): void;
}

export interface IGroup {
  readonly size: SizeLike;

  visibility: boolean;
  position: PointLike;
  pivot: IPoint;

  rotate(angle: number, center?: PointLike): void;

  remove(): void;
}
