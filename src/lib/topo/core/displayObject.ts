import { Point } from 'paper';

import { DisplayObjectType, IDisplayObject, IPoint, PointLike, SizeLike } from '../types'

import { validatePointInput, validateSizeInput } from '../utils/converters'

/**
 * Abstract class representing a display frame.
 * @abstract
 */

abstract class DisplayObject {

	public isRendered: boolean;
	public isRemoved: boolean;
	protected _content: any;
	protected _position: any; // decide what is the definitive type for position
	private _size: any; // decide what is the definitive type for position
	private _ratio: number; // drop this property
	private pins: any;


	/**
	* Validates the size input.
	* @param {any} input - The size input to validate.
	* @returns {any} The validated size input.
	* @private
	*/


	/**
	* Gets the X coordinate from a point.
	* @param {any} point - The point to get the X coordinate from.
	* @returns {number} The X coordinate.
	* @private
	*/

	private static getX(point: any): number {
    // TODO: Implement logic...
		return point[0];
	}


	/**
	* Gets the Y coordinate from a point.
	* @param {any} point - The point to get the Y coordinate from.
	* @returns {number} The Y coordinate.
	* @private
	*/

	private static getY(point: any): number {
    // TODO: Implement logic...
		return point[1];
	}


	/**
	* Gets the width from a size.
	* @param {any} size - The size to get the width from.
	* @returns {number} The width.
	* @private
	*/

	private static getWidth(size: any): number {
		// return this._content.bounds.width;
		return size[0];
	}


	/**
	* Gets the height from a size.
	* @param {any} size - The size to get the height from.
	* @returns {number} The height.
	* @private
	*/

	private static getHeight(size: any): number {
		// return this._content.bounds.height;
		return size[1];
	}


	/**
	* Creates an instance of DisplayObject.
	* @param {any} position - The initial position of the display frame.
	* @param {any} size - The initial size of the display frame.
	*/

	constructor( position: PointLike, size: SizeLike ) {

		this._position = validatePointInput( position );
		this._size = validateSizeInput( size );
		this._ratio = 0// null;
		this._content = null;

		this.isRendered = false;
		this.isRemoved = false;

		this.pins = {

			CENTER: () => [this._content.bounds.center.x, this._content.bounds.center.y],
			BC: () => [this._content.bounds.bottomCenter.x, this._content.bounds.bottomCenter.y],
			BL: () => [this._content.bounds.bottomLeft.x, this._content.bounds.bottomLeft.y],
			TL: () => [this._content.bounds.topLeft.x, this._content.bounds.topLeft.y],
			TR: () => [this._content.bounds.topRight.x, this._content.bounds.topRight.y],
			BR: () => [this._content.bounds.bottomRight.x, this._content.bounds.bottomRight.y],
		};
	}


	/**
	* Updates the position of the display frame.
	* @param {any} input - The new position of the display frame.
	* @throws {Error} If the input type is incorrect.
	* @private
	*/

	private updatePosition( input: PointLike ): void {

		const output = validatePointInput(input);

		if (output) {

			this._position = output;

		} else {

			throw new Error( "! ERROR@[DisplayObject][position]: wrong input type" );
		}
	}


	/**
	* Updates the size of the display frame.
	* @param {any} input - The new size of the display frame.
	* @throws {Error} If the input type is incorrect.
	* @private
	*/

	private updateSize( input: SizeLike ): void {
		
		const output = validateSizeInput(input);

		if (output) {
			
			this._size = output;
			this._ratio = DisplayObject.getWidth(this._size) / DisplayObject.getHeight(this._size);

		} else {

			throw new Error("! ERROR@[DisplayObject][size]: wrong input type");
		}
	}

  /**
   * Gets the layer of the display frame.
   * @returns {any} The layer.
   */
	get content() {
		return this._content;
	}


	/**
   * Gets the position of the display frame.
   * @returns {any} The position.
   */
	set position( input: any ) {

		this.placeAt( input );
	}


  /**
   * Gets the position of the display frame.
   * @returns {any} The position.
   */
	get position() {
		return this._position;
	}

  /**
   * Gets the X coordinate of the display frame's position.
   * @returns {number} The X coordinate.
   */
	get x() {
		return DisplayObject.getX(this._position);
	}


	/**
	* Gets the Y coordinate of the display frame's position.
	* @returns {number} The Y coordinate.
	*/
	
	get y() {
		return DisplayObject.getY(this._position);
	}


	/**
	* Sets the size of the display frame.
	* @param {any} input - The size to set.
	*/
	
	set size(input: any) {

		this.updateSize(input);
		this.render( null );
	}


	/**
	* Gets the size of the display frame.
	* @returns {any} The size.
	*/

	get size(): any {
		return this._size;
	}

	/**
	* Gets the width of the display frame.
	* @returns {number} The width.
	*/

	get width() {
		return DisplayObject.getWidth(this._size);
	}

	/**
	* Gets the height of the display frame.
	* @returns {number} The height.
	*/

	get height() {
		return DisplayObject.getHeight(this._size);
	}

  /**
   * Gets a pin point of the display frame with an optional offset.
   * @param {string} LABEL - The label of the pin point.
   * @param {any} offset - The optional offset from the pin point.
   * @returns {Point} The pin point.
   * @protected
   */

	protected getPin(LABEL: string, offset: any): IPoint {

		if (offset && validatePointInput(offset)) {

			const position = this.pins[LABEL]();

			return new Point(
			                 DisplayObject.getX(position) + DisplayObject.getX(offset),
			                 DisplayObject.getY(position) + DisplayObject.getY(offset)
			                 );

		} else {

			return this.pins[LABEL]();
		}
	}


  /**
   * Renders the display frame with the specified size.
   * @param {any} size - The size to render the display frame with.
   * @throws {Error} If no size is provided.
   */

	protected render( item: any ): void {
		
		if ( item && !this.isRendered ) {

			this._content = item;

			this._content.visible = true;

			this.isRendered = true;

		} else {

			throw new Error( "! ERROR@[DisplayObject][render]: there's nothing to render" );
		}
	}


  /**
   * Places the display frame at the specified position.
   * @param {any} position - The position to place the display frame at.

   */

	public placeAt( position: PointLike, pivot?: PointLike ): void {

		this.updatePosition( position );

		if ( pivot ) {

			this._content.pivot = validatePointInput( pivot );
		}

		this._content.position = this._position;

	}


  /**
   * Removes the display frame from the layer.
   */
	public remove(): void {

		if (this.isRendered && !this.isRemoved) {
			
			this._content.remove();
			this.isRemoved = true;
		}
	}

  /**
   * Updates the display frame.
   * @abstract
   */
	protected update() {};
}

export default DisplayObject;



