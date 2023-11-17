import { Point, Path, Group } from 'paper';

import { PathLocationData, UnitIntervalNumber, IHyperPoint, PointLike, SizeLike } from '../../lib/topo/types';
import { validatePointInput, convertToSegment, convertToPoint } from '../../lib/topo/utils/converters';

import AttractorObject from '../../lib/topo/core/attractorObject';
import HyperPoint from '../../lib/topo/core/hyperPoint';



class Spine extends AttractorObject {


	private _A: any
	private _B: any

	// protected _path: any


	private _debugPath1: any
	private _debugPath2: any
	private _debugPath3: any
	private _debugPath4: any
	private _arrow: any;


	static project( positionData: PointLike | IHyperPoint | [ IHyperPoint, IHyperPoint ], length: number | null = null, ) {

		let _projectedPath

		// --------------------------------------------------------------
		// Create Spine from 2 points
		
		// TODO: validate positionData

		if ( Array.isArray( positionData ) && positionData.length === 2 ) {

			// TODO: check if it's a Hyperpoint or paper.segments.

			const sgms = positionData.map( (pt) => convertToSegment(pt) );
			
			_projectedPath = new Path({

				segments: [ ...sgms ],
			});

			return _projectedPath;


		// --------------------------------------------------------------
		// Create Spine from 1 point

		} else if ( length ) { 
			
			const _C = convertToPoint( positionData );

			const _vA = new Point( { angle: 180, length: length/2 });
			const _vB = new Point( { angle: 0, length: length/2 });

			const _A = new Point( _C.add( _vA ) );
			const _B = new Point( _C.add( _vB ) );

			_projectedPath = new Path({

				segments: [ _A, _B ]
			});

			return _projectedPath;

		} else {

			return new Path( { segments: [ [0,0 ] ]});
		}
	};


	constructor( length: number, positionData: PointLike | IHyperPoint | [ IHyperPoint, IHyperPoint ] = new HyperPoint( new Point(0,0)) ) {

		const _path = Spine.project( positionData, length );

	 	super( _path.bounds.size, _path.getPointAt( _path.length/2 ) );

		// -------------------------------
		// DEBUG

		this._debugPath1 = new Path();
		this._debugPath2 = new Path();
		this._debugPath3 = new Path();
		this._debugPath4 = new Path();

		this._arrow = new Group()

		// -------------------------------

		this._A = new HyperPoint( _path.firstSegment.point, _path.firstSegment.handleIn, _path.firstSegment.handleOut );
		this._B = new HyperPoint( _path.lastSegment.point, _path.lastSegment.handleIn, _path.lastSegment.handleOut );			

		this.render();

		return this;

	}


	protected render() {

		if ( this.isRendered ) {

			this.content.remove();
			this.isRendered = false
		}

		this._path = new Path({

			segments: [ this._A.getSegment(), this._B.getSegment() ],
			// segments: [ this._A.point.add(this._position), this._B.point.add(this._position) ],
			strokeColor: '#02B7FD'
		});

		// this._path.fullySelected = true;

		this.addOrientationArrow()
		
		super.render( new Group( [ this._path, this._arrow ] ))
	}


	protected adjustRotationToPosition( position: number ) {

		if ( position > 0.25 && position < 0.75 ) {

			return 0;

		} else {

			return 0;
		}
	};


	protected adjustToOrientation( anchor: any ) {

		if ( anchor.position > 0.25 && anchor.position < 0.75 ) {

			this.orientation = 1;

		} else {

			this.orientation = 1;
		}
	};

	protected adjustToPolarity( anchor: any ) {

		// TODO

		this.polarity = 1;
	};


	protected getPathLocationDataAt( at: number ): PathLocationData {

		const loc = this._path.getLocationAt( this._path.length * at );

		return { point: loc.point, tangent: loc.tangent, normal: loc.normal, curveLength: loc.curve.length, pathLength: loc.path.length, at: at };
	};
	

	private addOrientationArrow() {

		this._debugPath1.remove()
		this._debugPath2.remove()
		this._debugPath3.remove()
		this._debugPath4.remove()

		this._arrow.remove()

		this._arrow = new Group()

		let midPoint = this._path.getPointAt(this._path.length/2)

		this._debugPath1 = new Path({ segments: [ midPoint, this._path.segments[1] ], strokeColor: '#70D9FF' })
		
		let _A = this._debugPath1.lastSegment.point.subtract( this._debugPath1.lastSegment.location.tangent.multiply(5) )
		let _Ar = _A.rotate( 30, this._debugPath1.lastSegment.point )
		
		let _B = this._debugPath1.lastSegment.point.subtract( this._debugPath1.lastSegment.location.tangent.multiply(5) )
		let _Br = _B.rotate( -40, this._debugPath1.lastSegment.point )

		this._debugPath2 = new Path( {
		                            segments: [ this._debugPath1.lastSegment.point, _Ar ],
		                            strokeColor: '#70D9FF' })
		
		this._debugPath3 = new Path( {
		                            segments: [ this._debugPath1.lastSegment.point, _Br ],
		                            strokeColor: '#70D9FF' })

		this._debugPath4 = new Path.Circle({center: midPoint, radius: 2, fillColor: '#70D9FF'})
	

		this._arrow.addChild(this._debugPath1)
		this._arrow.addChild(this._debugPath2)
		this._arrow.addChild(this._debugPath3)
		this._arrow.addChild(this._debugPath4)

	}

	public clearGuides() {

		// TODO
	}


	// public anchorAt( location: any, along: string = 'RAY' ) {

	// 	super.anchorAt( location, along );
	// 	// this.rotate(180);
	// }

}


export default Spine;


