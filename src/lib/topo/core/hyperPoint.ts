import { BooleanLike, VectorDirection, IPoint, PointLike, SizeLike } from '../types';

import { validatePointInput } from '../utils/converters'

import DebugDot from '../utils/debugDot'

import { Point, Segment, Path, Group } from 'paper';


class HyperPoint {

	private _point: IPoint;
	private _handleIn: IPoint;
	private _handleOut: IPoint;

	private _position: number = -1;
	private _spin: number;
	private _polarity: number;

	private AXIS: any = {
	    'TAN': null,
	    'RAY': null,
	    'VER': null,
	    'HOR': null,
	};

	// private _debugPath1: any
	// private _debugPath2: any
	// private _debugDot1: any
	// private _debugDot2: any

	private _debugGuides: any


	/**
   * Creates a new HyperPoint instance.
   * @param {Object} point - The point object representing the position of the hyperpoint.
   * @param {Object|null} handleIn - The handleIn object representing the incoming handle of the hyperpoint.
   * @param {Object|null} handleOut - The handleOut object representing the outgoing handle of the hyperpoint.
   */

	constructor( point: PointLike, handleIn: PointLike | null = null, handleOut: PointLike | null = null ) {

		this._point = validatePointInput( point );

		this._handleIn = validatePointInput(handleIn);
		this._handleOut = validatePointInput(handleOut);

		this._spin = 1;
		this._polarity = 1;

		this._debugGuides = new Group();

		// this._debugPath1 = new Path()
		// this._debugPath2 = new Path()
		// this._debugDot1 = new Path()
		// this._debugDot2 = new Path()

		return this;

	}

	set position( value: number ) {

		this._position = value;
	}

	get position() {

		return this._position;
	}


	set x( value: any ) {

		throw new Error(`! ERROR: Can't set x property on a HyperPoint`)
	}

	get x() {

		return this._point.x
	}


	set y( value: any ) {

		throw new Error(`! ERROR: Can't set y property on a HyperPoint`)
	}


	get y() {

		return this._point.y
	}


	set point( value: any ) {

		throw new Error(`! ERROR: Can't set point property on a HyperPoint`)
	}


	get point() {

		return this._point;
	}

	get handleIn() {

		return this._handleIn;
	}

	get handleOut() {

		return this._handleOut;
	}


	set handleIn( pt: any ) {

		this._handleIn = pt;
	}

	set handleOut( pt: any ) {

		this._handleOut = pt;
	}


	// ---------------------------------------------------------
	// 
	
	set spin( value: number ) {

		this._spin = value

		let a = value === 1 ? 0 : 180

		this.AXIS.HOR = new Point( { angle: a, length: 1 })
		this.AXIS.VER = new Point( { angle: 90, length: 1 })

		if ( this.AXIS.TAN !== null ) { this.AXIS.TAN = this.AXIS.TAN.multiply(this._spin) }
		// if ( this.AXIS.RAY !== null ) { this.AXIS.RAY = this.AXIS.RAY.multiply(this._spin) }


	}

	set polarity( value: number ) {

		this._polarity = value;

		if ( this.AXIS.RAY !== null ) {

			this.AXIS.RAY.multiply( this._polarity );
		}
	}

	get spin() {

		return this._spin;
	}

	get polarity() {

		return this._polarity;
	}

	set tangent( point: any ) {

		this.AXIS.TAN = point.normalize();
		// this.AXIS.TAN = this._spin === -1 ? point : point.multiply(this._spin);

		// this._handleOut = this.AXIS.TAN
		// this._handleIn = this.AXIS.TAN * -1
	}

	set normal( point: any ) {

		this.AXIS.RAY = point.normalize();
		// this.AXIS.RAY = this._spin === -1 ? point.multiply(this._spin) : point;

		// this.AXIS.RAY = point.multiply(-1)
	}

	get tangent() {

		return this.AXIS.TAN;
	}

	get normal() {

		return this.AXIS.RAY;
	}

	

	public getSegment( withInHandle: BooleanLike = true, withOutHandle: BooleanLike = true ): any {
	  
		const includeInHandle = Boolean(withInHandle);
		const includeOutHandle = Boolean(withOutHandle);		
		
		let hIn;
		let hOut;

		 if (includeInHandle ) {
		   hIn = this._handleIn;
		 }

		if (includeOutHandle ) {
		  hOut = this._handleOut;
		}

		return new Segment(this._point, hIn, hOut);
	}


	public flip(): HyperPoint {

	    // const temp = this._handleIn;
	    // this._handleIn = this._handleOut;
	    // this._handleOut = temp;

	    [ this._handleIn, this._handleOut ] = [ this._handleOut, this._handleIn ];

	    return this;
  	}


	public scaleHandles( scale: number, scaleIn: BooleanLike = true, scaleOut: BooleanLike = true ): HyperPoint {
		
		if (scaleIn) {

		    if (scale >= 0 && scale <= 1) {

		      this._handleIn.length *= scale;

		    } else if (scale > 1) {

		      // this._handleIn.length = scale;
		      this._handleIn.length *= scale;
		    }
		}

		if (scaleOut) {

		    if (scale >= 0 && scale <= 1) {

		      this._handleOut.length *= scale;

		    } else if (scale > 1) {

		      // this._handleOut.length = scale;
		      this._handleOut.length *= scale;
		    }
		}

  		return this;
	}


	public offsetBy( by: number, along: VectorDirection ): HyperPoint {

		// console.log(`@${this.ID} --> spin: ${this._spin}`)

		const d = by * this._polarity;

		const v = this.AXIS[ along ];

		/* DEBUG */  const debugPath = new Path({

			segments: [ this._point ],
			strokeColor: '#FFAE29' 
		});

		this._point = this._point.add( v.multiply(d) );
		
		/* DEBUG */  debugPath.add( this._point );
		/* DEBUG */  const debugDot = new DebugDot( this._point, '#FFAE29', 2) // orange

		this._debugGuides.addChildren( [ debugPath, debugDot ] )

		return this;
	}

	

	public steer( tilt: number, aperture: number = 180, hScale: number = 1 ): HyperPoint {

		const axis = this.AXIS.RAY.angle + tilt * this._spin;

		this._handleOut = new Point({ angle: axis + aperture/2 * this._spin, length: this._handleOut.length * hScale });
		this._handleIn = new Point({ angle: axis - aperture/2 * this._spin, length: this._handleIn.length * hScale });

		// this._handleOut.angle += ( tilt )
		// this._handleIn.angle += ( tilt )


		/* DEBUG */

		const _debugPath1 = new Path({segments: [this._point, this._point.add(this._handleOut.multiply(1))], strokeColor: '#02B7FD'})
		const _debugPath2 = new Path({segments: [this._point, this._point.add(this._handleIn.multiply(1))], strokeColor: '#02B7FD'})
		const _debugDot1 = new DebugDot(this._point.add(this._handleOut.multiply(1)), '#FFAE29', 2) // orange
		const _debugDot2 = new DebugDot(this._point.add(this._handleIn.multiply(1)), '#FFE44F', 2) // yellow

		this._debugGuides.addChildren( [ _debugPath1, _debugPath2, _debugDot1, _debugDot2 ] );

		/* */

		return this

	}

	public clone(): HyperPoint {

	  const _clone = new HyperPoint(

	    this._point.clone(),
	    this._handleIn ? this._handleIn.clone() : null,
	    this._handleOut ? this._handleOut.clone() : null
	    
	  );

	  _clone.position = this._position;
	  _clone.spin = this._spin;

	  _clone.AXIS = {

	    TAN: this.AXIS.TAN ? this.AXIS.TAN.clone() : null,
	    RAY: this.AXIS.RAY ? this.AXIS.RAY.clone() : null,
	    VER: this.AXIS.VER ? this.AXIS.VER.clone() : null,
	    HOR: this.AXIS.HOR ? this.AXIS.HOR.clone() : null,
	  };


	  return _clone;

	}

	public clearGuides(): void {

		this._debugGuides.removeChildren();
	}

}


export default HyperPoint;


