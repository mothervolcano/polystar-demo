
export type PointLike =
  | HyperPoint
  | [number, number]
  | { x: number; y: number }
  | { width: number; height: number }
  | { angle: number; length: number };

export type SizeLike = [number, number] | { x: number; y: number } | { width: number; height: number };

export type RectangleLike =
  | [number, number, number, number]
  | { x: number; y: number; width: number; height: number }
  | { from: PointLike; to: PointLike };

export type BooleanLike = Boolean | 0 | 1;

export type OrientationType = -1 | 1;
export type PolarityType = -1 | 1;
export type VectorDirection = "TAN" | "RAY" | "VER" | "HOR";


export interface TopoLocationData {
  point: TopoPoint;
  tangent: TopoPoint;
  normal: TopoPoint;
  curveLength: number;
  pathLength: number;
  at: number;
}


/***************************************************************************************
 * Base class in a composite pattern architecture. AttractorObject provides the interface 
 * and shared methods for the Attractor classes. It is extended by AttractorTopo, 
 * the leaf component, and AttractorField, the composite node.
 */

declare class AttractorObject {

  readonly determineOrientation: Function;
  readonly determineSpin: Function;
  readonly determinePolarity: Function;

  constructor(topo: TopoPath, anchor?: HyperPoint);

  addAttractor(attractor: AttractorObject): AttractorObject;
  getAttractor(index: number): AttractorObject;
  locate(at: number, orient?: boolean): HyperPoint | HyperPoint[];
  moveBy( by: number, along: VectorDirection): void
  rotate(angle: number): void;
  scale( hor: number, ver: number ): void;
  remove(): void;
}

declare class AttractorTopo extends AttractorObject {

  constructor(topo: TopoPath, anchor?: HyperPoint)
}

declare class AttractorField extends AttractorObject {

  constructor(topo: TopoPath, anchor?: HyperPoint)

  addAttractors(attractors: AttractorObject[]): void
  locateOn(iAttractor: number, at: number, orient: boolean): HyperPoint | HyperPoint[];
  locateOnSelf(at: number, orient: boolean): HyperPoint;
  revolve(angle: number): AttractorField;
  compress(start: number, end: number, alignAxis: boolean): AttractorField;
  expandBy(by: number, along: VectorDirection): AttractorField;
}

declare class OrbitalField extends AttractorField {
  constructor(length: number, anchor?: HyperPoint)
}

declare class Orbital extends AttractorTopo {
  constructor(length: number, anchor: HyperPoint);
}

declare class SpinalField extends AttractorField {
  constructor(length: number, anchor?: HyperPoint, mode?: string)
}

declare class Spine extends AttractorTopo {
  constructor(length: number, anchor?: HyperPoint);
}



/***************************************************************************************
 * A hyperPoint is a point extracted from a curve that serves as a guide for drawing.
 * It encapsulates the position, tangent, normal, and handles of the point.
 * The hyperpoint is primarily defined at the moment of extraction from the curve.
 *
 * The HyperPoint class provides methods to manipulate and transform the point along its tangent or normal vector.
 * It also allows setting the spin or orientation of the curve.
 *
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

/***************************************************************************************
 * Leaf component of a composite design for all the objects that require being rendered to the screen.
 * Works with DisplayNode, the node component.
 */

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

/***************************************************************************************
* TopoPoint acts as a wrapper for the Paper.js Point class, facilitating its integration
 * and use within the current application. This class is designed with the intent of 
 * gradually reducing dependency on Paper.js, aiming for a more flexible and independent
 * implementation.
 *
 */

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

/***************************************************************************************
 * Wrapper for the Paper.js Path class. Refer to TopoPoint for more info
 */

declare class TopoPath extends DisplayObject {
  size: SizeLike;
  position: PointLike;
  pivot: PointLike;
  center: PointLike;
  rotation: number;
  strokeColor: paper.Color | null;
  fillColor: paper.Color | null;
  visibility: boolean;
  length: number;
  closed: boolean;
  points: HyperPoint[];
  firstPoint: HyperPoint;
  lastPoint: HyperPoint;
  fullySelected: boolean;

  // static Circle(center: PointLike, radius: number): TopoPath

  constructor(...args: any[]);

  createCircle(center: PointLike, radius: number): TopoPath;
  addPoint(point: HyperPoint): void;
  add(...point: (HyperPoint | PointLike | number[])[]): void;
  insert(index: number, point: HyperPoint | PointLike): void;
  reverse(): void;
  scale(hor: number, ver: number, center?: PointLike): void;
  rotate(angle: number, center?: PointLike): void;
  getPointAt(offset: number): paper.Point;
  getLocationAt(offset: number): any;
  getPaperPath(): paper.Path;
  clone(): TopoPath
  reset(): void;
  remove(): void;
}

export interface IGroup {
  readonly size: SizeLike;

  visibility: boolean;
  position: PointLike;
  pivot: TopoPoint;

  rotate(angle: number, center?: PointLike): void;
  remove(): void;
}
