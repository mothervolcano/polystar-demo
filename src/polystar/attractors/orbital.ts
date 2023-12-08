import { TopoLocationData, TopoPoint } from '../../lib/topo/topo';
import { TopoOrbital, TopoPath } from '../../lib/topo/drawing/paperjs';
import { TopoPoint as CreateTopoPoint } from '../../lib/topo/drawing/paperjs';

import HyperPoint from '../../lib/topo/core/hyperPoint'
import AttractorTopo from '../../lib/topo/core/attractorTopo';


class Orbital extends AttractorTopo {

	// private _fixedOrientation: boolean;

	constructor(length: number, anchor?: HyperPoint ) {

		const topoPath: TopoPath = new TopoPath()

		// console.log('ORBITAL: ', topoPath)

		super(topoPath, anchor);
		this.setLength(length);
		this.draw();
	}

	draw() {

		if (this.anchor) {

			this.topo.reset();
			this.topo.visibility = true;

			this.topo.createCircle(this.anchor, this.length/Math.PI/2);
			this.topo.strokeColor = new paper.Color("blue");

			// this.topo.addOrientationArrow();
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
			this.scale(-1, 1);
			this.setSpin(-1);
		} else if (!this.determineSpin(this.anchor.position)) {
			this.scale(1, 1);
			this.setSpin(1);
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
			...loc,
			at: at,
		};
	}
	
}


export default Orbital;


