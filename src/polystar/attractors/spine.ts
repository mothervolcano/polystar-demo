import { TopoLocationData, TopoPoint as TopoPointType } from "../../lib/topo/topo";
import HyperPoint from "../../lib/topo/core/hyperPoint";
import AttractorTopo from "../../lib/topo/core/attractorTopo";
import { TopoPoint, TopoPath } from "../../lib/topo/drawing/paperjs";


class Spine extends AttractorTopo {

	constructor(length: number, anchor: HyperPoint = new HyperPoint([0,0]) ) {

		const topoPath: TopoPath = new TopoPath()

		// console.log('SPINE: ', topoPath)

		super(topoPath, anchor);
		this.setLength(length);
		this.draw();
	}

	draw() {

		if (this.anchor) {

			this.topo.reset();
			const A: TopoPointType = this.anchor.point.subtract([this.length/2, 0]);
			const B: TopoPointType = this.anchor.point.add([this.length/2, 0]);
			this.topo.add(A,B);

			this.topo.visibility = true;
			this.topo.strokeColor = new paper.Color("blue");
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
			this.setAxisAngle(0);
		} else {
			throw new Error("POSSIBLY TRYING TO ANCHOR OUTSIDE OF FIELDs BOUNDS");
		}
	}

	adjustToSpin() {
		if (this.determineSpin(this.anchor.position)) {
			this.setSpin(1);
		} else if (!this.determineSpin(this.anchor.position)) {
			this.setSpin(1);
		} else {
			throw new Error("POSSIBLY TRYING TO PLACE THE ATTRACTOR OUTSIDE OF FIELDs BOUNDS");
		}
	}

	adjustToPolarity() {
		// TODO
		this.setPolarity(1);
	}

	// at is provided by attractors that have paths that are non-linear ie. the input location doesn't match the mapped location.
	createAnchor(locationData: TopoLocationData): HyperPoint {
		const { point, tangent, normal, curveLength, pathLength, at } = locationData;

		const factor = [0, 0.25, 0.5, 0.75].includes(at) ? 1 / 3 : curveLength / pathLength;

		const hIn = tangent.multiply(curveLength * factor).multiply(-1);
		const hOut = tangent.multiply(curveLength * factor);

		const anchor = new HyperPoint(point, hIn, hOut);

		anchor.position = at;
		anchor.setTangent( new TopoPoint(tangent.multiply(this.spin)) ); // HACK: because the path is flipped using scale() the vectors need to be inverted
		anchor.setNormal( new TopoPoint(normal.multiply(this.spin)) );
		anchor.spin = this.spin;
		anchor.polarity = this.polarity;

		return anchor;
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

export default Spine;