import { Point, Segment } from 'paper';



export type VectorDirection = 'TAN' | 'RAY' | 'VER' | 'HOR';


export type UnitIntervalNumber = number & { 0: number, 1: number };

// export type UnitIntervalNumber<T extends number = number> = T & { 0: number, 1: number };



export type BooleanLike = (

                           Boolean | 0 | 1

                           )

export type PointLike = (

                         IHyperPoint
                         | [ number, number ]
                         | { x: number, y: number }
                         | { width: number, height: number }
                         | { angle: number, length: number }
                         )

export type SizeLike = (

                        [ number, number ]
                        | { x: number, y: number }
                        | { width: number, height: number }
                        )

export type RectangleLike = (

                             [ number, number, number, number ]
                             | { x: number, y: number, width: number, height: number }
                             | { from: PointLike, to: PointLike }
                             )


export interface PathLocationData {

  point: IPoint;
  tangent: IPoint;
  normal: IPoint;
  curveLength: number;
  pathLength: number;
  at: number;
}


export interface IDisplayObject {

  ID: string;
  position: any;
  size: any;
  tag: string;
  layer: any;
  remove(): void;
  placeAt(position: any, anchor: any): void;
  moveBy(vector: any, distance: number): void;
  // Add more methods as needed
  // ...
}


export interface IAttractorObject {

  orientation: number;
  polarity: number;
  center: IHyperPoint;
  anchor: IHyperPoint;
  anchorAt( anchor: IHyperPoint, along: VectorDirection ): void;
  locate( position: number, orient: boolean ): IHyperPoint;

}


// export type DisplayObjectType<T extends DisplayObject> = new (...args: any[]) => T;

export interface DisplayObjectType { content: any, position: any, size: any };


export interface IPoint {

   /** 
   * The x coordinate of the point
   */
  x: number

  /** 
   * The y coordinate of the point
   */
  y: number

  /** 
   * The length of the vector that is represented by this point's coordinates.
   * Each point can be interpreted as a vector that points from the origin (`x
   * = 0`, `y = 0`) to the point's location. Setting the length changes the
   * location but keeps the vector's angle.
   */
  length: number

  /** 
   * The vector's angle in degrees, measured from the x-axis to the vector.
   */
  angle: number

  /** 
   * The vector's angle in radians, measured from the x-axis to the vector.
   */
  angleInRadians: number

  /** 
         * Returns a copy of the point.
         * 
         * @return the cloned point
         */
        clone(): IPoint

  /** 
         * Returns the distance between the point and another point.
         * 
         * @param squared - Controls whether the distance should
         * remain squared, or its square root should be calculated
         */

  getDistance(point: PointLike, squared?: boolean): number

        /** 
         * Normalize modifies the {@link #length} of the vector to `1` without
         * changing its angle and returns it as a new point. The optional `length`
         * parameter defines the length to normalize to. The object itself is not
         * modified!
         * 
         * @param length - The length of the normalized vector
         * 
         * @return the normalized vector of the vector that is represented
         *     by this point's coordinates
         */
  normalize(length?: number): IPoint

        /** 
         * Rotates the point by the given angle around an optional center point.
         * The object itself is not modified.
         * 
         * Read more about angle units and orientation in the description of the
         * {@link #angle} property.
         * 
         * @param angle - the rotation angle
         * @param center - the center point of the rotation
         * 
         * @return the rotated point
         */
  rotate(angle: number, center?: PointLike): IPoint

        /** 
         * Transforms the point by the matrix as a new point. The object itself is
         * not modified!
         * 
         * @return the transformed point
         */

  add(number: number): IPoint

        /** 
         * Returns the addition of the supplied point to the point as a new
         * point.
         * The object itself is not modified!
         * 
         * @param point - the point to add
         * 
         * @return the addition of the two points as a new point
         */
  add(point: PointLike): IPoint

        /** 
         * Returns the subtraction of the supplied value to both coordinates of
         * the point as a new point.
         * The object itself is not modified!
         * 
         * @param number - the number to subtract
         * 
         * @return the subtraction of the point and the value as a new point
         */
  subtract(number: number): IPoint

        /** 
         * Returns the subtraction of the supplied point to the point as a new
         * point.
         * The object itself is not modified!
         * 
         * @param point - the point to subtract
         * 
         * @return the subtraction of the two points as a new point
         */
  subtract(point: PointLike): IPoint

        /** 
         * Returns the multiplication of the supplied value to both coordinates of
         * the point as a new point.
         * The object itself is not modified!
         * 
         * @param number - the number to multiply by
         * 
         * @return the multiplication of the point and the value as a new
         *     point
         */
  multiply(number: number): IPoint

        /** 
         * Returns the multiplication of the supplied point to the point as a new
         * point.
         * The object itself is not modified!
         * 
         * @param point - the point to multiply by
         * 
         * @return the multiplication of the two points as a new point
         */
  multiply(point: PointLike): IPoint

        /** 
         * Returns the division of the supplied value to both coordinates of
         * the point as a new point.
         * The object itself is not modified!
         * 
         * @param number - the number to divide by
         * 
         * @return the division of the point and the value as a new point
         */
  divide(number: number): IPoint

        /** 
         * Returns the division of the supplied point to the point as a new
         * point.
         * The object itself is not modified!
         * 
         * @param point - the point to divide by
         * 
         * @return the division of the two points as a new point
         */
  divide(point: PointLike): IPoint

        /** 
         * The modulo operator returns the integer remainders of dividing the point
         * by the supplied value as a new point.
         * 
         * @return the integer remainders of dividing the point by the value
         * as a new point
         */
  modulo(value: number): IPoint

        /** 
         * The modulo operator returns the integer remainders of dividing the point
         * by the supplied value as a new point.
         * 
         * @return the integer remainders of dividing the points by each
         * other as a new point
         */
  modulo(point: PointLike): IPoint

        /** 
         * Checks whether the point is inside the boundaries of the rectangle.
         * 
         * @param rect - the rectangle to check against
         * 
         * @return true if the point is inside the rectangle
         */
}


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


export interface IHyperPoint {


  /** 
  * x coordinate;
  */
  readonly x: number;
  
  /** 
  * y coordinate;
  */
  readonly y: number;

  /** 
  * xy representation of the HyperPoint;
  */
  readonly point: IPoint;

  /** 
  * The position in the Attractor's path from where the HyperPoint was derived as a value between 0 and 1.
  * It corresponds to value passed as the main parameter to AttractorObject.locate() or AttractorObject.anchorAt()
  */
  position: number;

  /** 
  * The normalized vector representing the tangent of the HyperPoint. 
  */
  tangent: IPoint | null;

  /** 
  * The normalized vector representing the tangent of the HyperPoint. 
  */
  normal: IPoint | null;

  /** 
  * The spin defines the orientation of the HyperPoint and is derived from the Orientation property of the Attractor from which it was derived.
  * It affects mainly the direction of the tangent vector.
  */
  spin: number;

  handleIn: IPoint;
  handleOut: IPoint;

  scaleHandles( scale: number, scaleIn?: BooleanLike, scaleOut?: BooleanLike ): IHyperPoint;

   /**
   * Offsets the hyperpoint along a specified vector.
   * @param {number} by - The distance to offset the hyperpoint.
   * @param {string} along - The vector along which to offset the hyperpoint ('TAN', 'RAY', 'VER', 'HOR').
   * @returns {HyperPoint} - The HyperPoint instance to allow for method chaining.
   */

  offsetBy(by: number, along: string): IHyperPoint;

  /**
   * Steers the hyperpoint by adjusting the handles.
   * @param {number} tilt - The tilt angle to apply to the handles.
   * @param {number} aperture - The aperture angle to apply to the handles.
   * @returns {HyperPoint} - The HyperPoint instance.
   */

  steer( tilt: number, aperture?: number, hScale?: number ): IHyperPoint;

  /**
   * Gets a segment object representing the hyperpoint.
   * @param {BooleanLike} [withInHandle=true] - Specifies whether to include the in handle in the segment.
   * @param {BooleanLike} [withOutHandle=true] - Specifies whether to include the out handle in the segment.
   * @returns {Object} - The segment object representing the hyperpoint.
   */

  flip(): IHyperPoint;

  getSegment(withInHandle?: BooleanLike, withOutHandle?: BooleanLike ): any;

  clone(): IHyperPoint;
  
}