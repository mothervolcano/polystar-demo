import { Path, Group } from 'paper';

import { PathLocationData, UnitIntervalNumber, IHyperPoint, PointLike, SizeLike } from '../../lib/topo/types';
import { validateSizeInput} from '../../lib/topo/utils/converters'

import AttractorObject from '../../lib/topo/core/attractorObject'
import HyperPoint from '../../lib/topo/core/hyperPoint'


class Orbital extends AttractorObject {

	
	// private _debugPath1: any;
	// private _debugPath2: any;
	// private _debugPath3: any;
	// private _debugPath4: any;
	// private _arrow: any;

	// private _fixedOrientation: boolean;


	constructor( radius: SizeLike | number, position: PointLike = {x:0, y:0}, orientation?: number ) {

		super( validateSizeInput(radius), position );

		this.radius = Array.isArray(radius) ? radius[0] : radius;

		// this._debugPath1 = new Path();
		// this._debugPath2 = new Path();
		// this._debugPath3 = new Path();
		// this._debugPath4 = new Path();

		// this._arrow = new Group();

		this.render();

		
		// TODO: review this. The idea was to define the orientation permanently and prevent it from being reset by fields
		if (orientation) this.adjustToOrientation( orientation );

		// this._fixedOrientation = false;

		// if ( orientation !== null ) {

		// 	this.adjustToOrientation( orientation );
		// 	this._fixedOrientation = true;
		// }

		return this;

	}


	protected render() {

		if ( this.isRendered ) {

			this._content.remove();
			this.isRendered = false;
		}	

		this._path = new Path.Ellipse({

			center: this.position,
			radius: this.size,
			strokeColor: '#00A5E0'
		})

		/* DEBUG */
		// this.addOrientationArrow();

		// super.render( new Group( [ this._path, this._arrow ] ) );
		super.render( this._path );

	};

	protected adjustRotationToPosition( position: number ) {

		if ( position > 0.25 && position < 0.75 ) {

			return 0;

		} else {

			return -180;
		}
	};


	public adjustToOrientation( anchor: any ) {

		if ( anchor.position > 0.25 && anchor.position < 0.75 ) {

			this.scale( -1, 1 );
			this.orientation = -1;

		} else {

			this.scale( 1, 1 );
			this.orientation = 1;
		}
	};


	protected adjustToPolarity( anchor: any ) {

		// this.scale( 1, value );
	};


	protected getPathLocationDataAt( at: number ): PathLocationData {

		const loc = this._path.getLocationAt( this._path.length * at );

		return { point: loc.point, tangent: loc.tangent, normal: loc.normal, curveLength: loc.curve.length, pathLength: loc.path.length, at: at };
	};


	// private addOrientationArrow() {

	// 	this._debugPath1.remove();
	// 	this._debugPath2.remove();
	// 	this._debugPath3.remove();
	// 	this._debugPath4.remove();

	// 	this._arrow.remove();

	// 	this._arrow = new Group();

	// 	this._debugPath1 = new Path({ segments: [ this._path.segments[0], this._path.segments[1] ], strokeColor: '#70D9FF' });
		
	// 	let _A = this._debugPath1.lastSegment.point.subtract( this._debugPath1.lastSegment.location.tangent.multiply(5) );
	// 	let _Ar = _A.rotate( 30, this._debugPath1.lastSegment.point );
		
	// 	let _B = this._debugPath1.lastSegment.point.subtract( this._debugPath1.lastSegment.location.tangent.multiply(5) );
	// 	let _Br = _B.rotate( -40, this._debugPath1.lastSegment.point );

	// 	this._debugPath2 = new Path( {
	// 	                            segments: [ this._debugPath1.lastSegment.point, _Ar ],
	// 	                            strokeColor: '#70D9FF' });
		
	// 	this._debugPath3 = new Path( {
	// 	                            segments: [ this._debugPath1.lastSegment.point, _Br ],
	// 	                            strokeColor: '#70D9FF' });

	// 	this._debugPath4 = new Path.Circle({center: this._debugPath1.firstSegment.point, radius: 2, fillColor: '#70D9FF'});
	

	// 	this._arrow.addChild(this._debugPath1);
	// 	this._arrow.addChild(this._debugPath2);
	// 	this._arrow.addChild(this._debugPath3);
	// 	this._arrow.addChild(this._debugPath4);

	// }

	public reset() {

		this._orientation = 1;
		this._polarity = 1;

		this.render();
	}

	// public anchorAt( location: any ) {

	// 	super.anchorAt( location );
	// 	this.rotate(180);
	// }
	
}


export default Orbital;


