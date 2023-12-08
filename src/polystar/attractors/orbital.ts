import { TopoLocationData, TopoPoint } from '../../lib/topo/topo';
import { TopoPath } from '../../lib/topo/drawing/paperjs';
import { TopoPoint as CreateTopoPoint } from '../../lib/topo/drawing/paperjs';

import HyperPoint from '../../lib/topo/core/hyperPoint'
import AttractorTopo from '../../lib/topo/core/attractorTopo';


class Orbital extends AttractorTopo {

	
	// private _debugPath1: any;
	// private _debugPath2: any;
	// private _debugPath3: any;
	// private _debugPath4: any;
	// private _arrow: any;

	// private _fixedOrientation: boolean;

	constructor(length: number, anchor?: HyperPoint ) {

		const topoPath: TopoPath = new TopoPath()

		// console.log('SPINE: ', topoPath)

		super(topoPath, anchor);
		this.setLength(length);
		this.draw();
	}

	draw() {

		if (this.anchor) {

			this.topo.reset();
			const A: TopoPoint = this.anchor.point.subtract([this.length/2, 0]);
			const B: TopoPoint = this.anchor.point.add([this.length/2, 0]);
			this.topo.add(A,B);

			this.topo.visibility = false;

			// this.topo.strokeColor = new paper.Color("blue");
		}
	}

	configureAttractor() {

		if (this.field) {

			this.setOrientationDeterminator(this.field.determineOrientation)
			this.setSpinDeterminator(this.field.determineSpin)
			this.setPolarityDeterminator(this.field.determinePolarity)
		}
	}

	adjustToPosition() {

		console.log('5 adjusting spine: ', this.anchor.position)

		if (this.determineOrientation(this.anchor.position)) {
			this.setAxisAngle(0);
		} else if (!this.determineOrientation(this.anchor.position)) {
			this.setAxisAngle(-180);
		} else {
			throw new Error("POSSIBLY TRYING TO ANCHOR OUTSIDE OF FIELDs BOUNDS");
		}
	}


	// protected adjustRotationToPosition( position: number ) {

	// 	if ( position > 0.25 && position < 0.75 ) {

	// 		return 0;

	// 	} else {

	// 		return -180;
	// 	}
	// };

	adjustToSpin() {
		if (this.determineSpin(this.anchor.position)) {
			this.setSpin(1);
		} else if (!this.determineSpin(this.anchor.position)) {
			this.setSpin(-1);
		} else {
			throw new Error("POSSIBLY TRYING TO PLACE THE ATTRACTOR OUTSIDE OF FIELDs BOUNDS");
		}
	}

	// public adjustToOrientation( anchor: any ) {

	// 	if ( anchor.position > 0.25 && anchor.position < 0.75 ) {

	// 		this.scale( -1, 1 );
	// 		this.orientation = -1;

	// 	} else {

	// 		this.scale( 1, 1 );
	// 		this.orientation = 1;
	// 	}
	// };

	createAnchor(locationData: TopoLocationData): HyperPoint {
		const { point, tangent, normal, curveLength, pathLength, at } = locationData;

		const factor = [0, 0.25, 0.5, 0.75].includes(at) ? 1 / 3 : curveLength / pathLength;

		const hIn = tangent.multiply(curveLength * factor).multiply(-1);
		const hOut = tangent.multiply(curveLength * factor);

		const anchor = new HyperPoint(point, hIn, hOut);

		anchor.position = at;

		anchor.setTangent( new CreateTopoPoint(tangent.multiply(this.spin)) ); // HACK: because the path is flipped using scale() the vectors need to be inverted
		anchor.setNormal( new CreateTopoPoint(normal.multiply(this.spin)) );
		anchor.spin = this.spin;
		anchor.polarity = this.polarity;

		return anchor;
	}


	adjustToPolarity() {
		// TODO
		this.setPolarity(1);
	}

	getTopoLocationAt(at: number): TopoLocationData {

		if ( !this.topo ) {

			throw new Error(`ERROR @Spine.getTopoLocationAt(${at}) ! Topo path is missing`)
		}

		const loc = this.topo.getLocationAt(this.topo.length * at);

		return {
			point: loc.point,
			tangent: loc.tangent,
			normal: loc.normal,
			curveLength: loc.curve.length,
			pathLength: loc.path.length,
			at: at,
		};
	}


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
	
}


export default Orbital;

