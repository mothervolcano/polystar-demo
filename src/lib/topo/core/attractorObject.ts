import { PathLocationData, UnitIntervalNumber, BooleanLike, VectorDirection, IPoint, IHyperPoint, PointLike, SizeLike } from '../types';

import DisplayObject from './displayObject';
import HyperPoint from './hyperPoint';
import { convertToHyperPoint } from '../utils/converters';

abstract class AttractorObject extends DisplayObject {

	protected _orientation: number;
	protected _polarity: number;

	protected _path: any;
	protected _anchor: IHyperPoint;

	protected _radius: SizeLike | number;

	private _axisAngle: number;
	
	// STATES. Set at creation time and meant to preserve original settings during transformations and redrawing.
	// The default is for the fields to organically adjust the attractors. These state properties allow to 
	// designate attractors to ignore the settings coming from the parent field.
	
	public isDisabled: boolean;
	public isSelfAnchored: boolean;
	public isAxisLocked: boolean;


	constructor( size: SizeLike, position: PointLike = {x:0, y:0} ) {

		super( position, size );

		this._orientation = 1;
		this._polarity = 1;

		this._anchor = convertToHyperPoint(position);

		this._radius = 0; // The radius value will depend on the type of attractor eg. Orbital, Spine and therefore it is defined by the subclass.

		this._axisAngle = 0;
		
		this.isDisabled = false;
		this.isAxisLocked = false;
		this.isSelfAnchored = false;

	};

	protected abstract getPathLocationDataAt( pos: number ): PathLocationData;
	protected abstract adjustToOrientation( value: number ): any;
	protected abstract adjustToPolarity( value: number ): any;


	set orientation( value: number ) {

		this._orientation = value;
	};


	get orientation() {

		return this._orientation;
	};


	set polarity( value: number ) {

		this._polarity = value;

	};


	get polarity() {

		return this._polarity;
	};


	set axisAngle( value: number ) {

		this._axisAngle = value;
	}


	get axisAngle() {

		return this._axisAngle;
	}


	// anchor is set when the attractor is placed in a field

	set anchor( pt: IHyperPoint ) {

		console.log(`!ERROR @AttractorObject: Anchor cannot be set directly. Attractor must be placed in and by a Field to be assigned an anchor`);

		// this._anchor = value;
	};


	get anchor() {

		return this._anchor;
	};


	get path() {

		return this._path;
	};

	get center() {

		return convertToHyperPoint( this._path.bounds.center );
	};

	set radius( value: SizeLike | number ) {

		this._radius = value;
	}

	// TODO: Perhaps a base property called Dimension to apply to both Orbitals and Spines as it would respectively mean radius and length?

	get radius() {

		return this._radius;
	}

	get length() {

		return this._path.length;
	};


	public getPath(): any {

		return this._path.clone();
	};


	// at is provided by attractors that have paths that are non-linear ie. the input location doesn't match the mapped location.
	private createAnchor({
	    
	    point,
	    tangent,
	    normal,
	    curveLength,
	    pathLength,
	    at,

	}: PathLocationData ): IHyperPoint {
		
		const factor = [0, 0.25, 0.50, 0.75 ].includes(at) ? 1/3 : curveLength/pathLength;

		const hIn = tangent.multiply( curveLength * factor ).multiply( -1 );
		const hOut = tangent.multiply( curveLength * factor );		

		const anchor = new HyperPoint( point, hIn, hOut );

		anchor.position = at;
		anchor.tangent = tangent.multiply(this._orientation); // HACK: because the path is flipped using scale() the vectors need to be inverted
		anchor.normal = normal.multiply(this._orientation);
		anchor.spin = this._orientation;
		anchor.polarity = this._polarity;

		return anchor;
	};


	public anchorAt( anchor: HyperPoint, along: VectorDirection = 'RAY'): void {

		this._anchor = anchor;
		this._anchor.spin = this._orientation;

		if ( !this.isAxisLocked ) {

			if ( along === 'TAN' ) {

				this._content.rotation = anchor.tangent.angle;

			} else {

				this._content.rotation = anchor.normal.angle;
			}	
		}
		
		this.rotate( this.axisAngle );
		this.placeAt( this._anchor.point, this._path.position );

	};


	public extractPath( A: IHyperPoint | number, B: IHyperPoint | number ): any {

		let P1;
		let P2;

		if ( typeof A === 'number' ) {

			P1 = this.getPathLocationDataAt( A ).point;

		} else if ( A.point ) {

			P1 = this._path.getNearestLocation( A.point ).point;
		}


		if ( typeof B === 'number' ) {

			P2 = this.getPathLocationDataAt( B ).point;

		} else if ( B.point ) {

			P2 = this._path.getNearestLocation( B.point ).point;
		}


		const extractedPath = this._path.clone()

		extractedPath.splitAt( extractedPath.getNearestLocation( P1 ) )
		let discardedPath = extractedPath.splitAt( extractedPath.getNearestLocation( P2 ) )

		extractedPath.strokeColor = 'red';
		extractedPath.strokeWidth = 5;

		discardedPath.remove();

		return extractedPath;

	};


	public locate( at: number, orient: boolean = false  ): IHyperPoint | null { // TODO: cast type

		const locationData = this.getPathLocationDataAt( at );

		if ( locationData ) {

			const pt = this.createAnchor( locationData );

			if ( orient && this._orientation === -1 ) { return pt.flip() } 

			return pt;

		} else {

			console.log(`! ERROR @AttractorObject.locate() : Unable to locate at`)

			return null
		}
	};


	public locateFirstIntersection( item: any, orient: boolean = false ) { // TODO: returns a hyperpoint

		if ( item instanceof AttractorObject ) {

			const intersections = this._path.getIntersections( item.getPath() );

			if ( intersections.length > 0 ) {

				const curveLocation = intersections[0];

				const pt = this.createAnchor( {   

					point: curveLocation.point, 
					tangent: curveLocation.tangent, 
					normal: curveLocation.normal, 
					curveLength: curveLocation.curve.length, 
					pathLength: curveLocation.path.length, 
					at: curveLocation.offset / curveLocation.path.length

				});

				if ( orient && this._orientation === -1 ) { return pt.flip() }

				return pt;
			}
		}
	};


	public locateLastIntersection( item: any, orient: boolean = false ) {

		if ( item instanceof AttractorObject ) {

			const intersections = this._path.getIntersections( item.getPath() );

			if ( intersections.length > 0 ) {

				const curveLocation = intersections.slice(-1)[0];

				const pt = this.createAnchor({

					point: curveLocation.point, 
					tangent: curveLocation.tangent, 
					normal: curveLocation.normal, 
					curveLength: curveLocation.curve.length, 
					pathLength: curveLocation.path.length, 
					at: curveLocation.offset / curveLocation.path.length
				})

				if ( orient && this._orientation === -1 ) { return pt.flip() }

				return pt;
			}
		}
	};


	public moveBy( by: number, along: VectorDirection ) {

		this._anchor.offsetBy( by, along );

		this.placeAt( this._anchor.point );

		return this;
	};


	public reverse() {

		this._content.reverse();

		return this;		
	};


	public scale( hor: number, ver: number ) {

		this._content.scale( hor, ver );
		this._radius = this._content.bounds.width;

		return this;
	};

	public skew( vector: IPoint ): any {

		// this._path.scale( hor, ver )
		this._content.shear( vector, this._path.position );

		return this;	
	};


	public rotate( angle: number ) {

		if ( !this.isAxisLocked ) {

			this._content.rotate( angle, this._anchor.point );
			this.axisAngle += angle;
		}
	};


	public reset() {
		
		this.remove();
		this.render( null );
	};


	public remove() {

		if ( this.isRendered ) {

			this._content.remove();
		}
	};

}


export default AttractorObject


