
import { IGroup, TopoPath, PointLike, SizeLike } from "../topo";
import { validatePointInput, validateSizeInput } from "../utils/converters";
import { TopoPoint } from "../drawing/paperjs";


/**
 * Abstract class representing a display frame.
 */

abstract class DisplayObject {
	public isRendered: boolean;
	public isRemoved: boolean;
	protected _content: TopoPath | IGroup | null;
	protected _position: TopoPoint;
	private _size: SizeLike;

	/**
	 * Gets the X coordinate from a point.
	 */

	private static getX(point: any): number {
		// TODO: Implement logic...
		return point[0];
	}

	/**
	 * Gets the Y coordinate from a point.
	 */

	private static getY(point: any): number {
		// TODO: Implement logic...
		return point[1];
	}

	/**
	 * Gets the width from a size.
	 */

	private static getWidth(size: any): number {
		// return this._content.bounds.width;
		return size[0];
	}

	/**
	 * Gets the height from a size.
	 */

	private static getHeight(size: any): number {
		// return this._content.bounds.height;
		return size[1];
	}

	/**
	 * Creates an instance of DisplayObject.
	 */

	constructor(position: PointLike, size?: SizeLike) {
		this._position = validatePointInput(position);
		this._size = validateSizeInput(size);
		
		this._content = null;

		this.isRendered = false;
		this.isRemoved = false;
	}

	/**
	 * Updates the position of the display frame.
	 */

	private updatePosition(input: PointLike): void {
		const output = validatePointInput(input);

		if (output) {
			this._position = output;
		} else {
			throw new Error("! ERROR@[DisplayObject][position]: wrong input type");
		}
	}

	/**
	 * Updates the size of the display frame.
	 */

	private updateSize(input: SizeLike): void {
		const output = validateSizeInput(input);

		if (output) {
			this._size = output;
		} else {
			throw new Error("! ERROR@[DisplayObject][size]: wrong input type");
		}
	}

	/**
	 * Gets the layer of the display frame.
	 */
	get content(): any {
		return this._content;
	}

	/**
	 * Sets the position of the display frame.
	 */
	// set position(input: any) {
	// 	this.placeAt(input);
	// }

	/**
	 * Gets the position of the display frame.
	 */
	get position(): PointLike {
		return this._position;
	}

	/**
	 * Gets the X coordinate of the display frame's position.
	 */
	get x(): number {
		return DisplayObject.getX(this._position);
	}

	/**
	 * Gets the Y coordinate of the display frame's position.
	 */

	get y(): number {
		return DisplayObject.getY(this._position);
	}

	/**
	 * Gets the size of the display frame.
	 */

	get size(): SizeLike {
		return this._size;
	}

	/**
	 * Gets the width of the display frame.
	 */

	get width(): number {
		return DisplayObject.getWidth(this._size);
	}

	/**
	 * Gets the height of the display frame.
	 */

	get height(): number {
		return DisplayObject.getHeight(this._size);
	}

	/**
	 * Renders the display frame with the specified item.
	 */

	protected render(item: TopoPath | IGroup): void {
		if (item && !this.isRendered) {
			this._content = item;
			this._content.visibility = true;
			this.isRendered = true;
		} else {
			throw new Error("! ERROR@[DisplayObject][render]: there's nothing to render");
		}
	}

	/**
   * Places the display frame at the specified position.
   */

	public placeAt(position: PointLike, pivot?: PointLike): void {
		this.updatePosition(position);

		// if ( !this.isRendered && this._content ) {
		if ( this._content ) {

			if (pivot) {
				this._content.pivot = validatePointInput(pivot);
			}

			this._content.position = this._position;
		}
	}

	/**
	 * Removes the display frame from the layer.
	 */
	public remove(): void {
		if (this.isRendered && !this.isRemoved && this._content) {
			this._content.remove();
			this.isRemoved = true;
		}
	}

	/**
	 * Updates the display frame.
	 */
	protected update(item: any) {
		this._content = item;
	}
}

export default DisplayObject;
