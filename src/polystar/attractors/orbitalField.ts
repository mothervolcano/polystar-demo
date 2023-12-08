import { TopoPoint, TopoLocationData } from "../../lib/topo/topo";
import AttractorField from "../../lib/topo/core/attractorField";
import HyperPoint from "../../lib/topo/core/hyperPoint";
import { TopoPath } from "../../lib/topo/drawing/paperjs";
import { TopoPoint as CreateTopoPoint } from '../../lib/topo/drawing/paperjs';

class OrbitalField extends AttractorField {
	constructor(length: number, anchor?: HyperPoint) {
		const topoPath = new TopoPath();

		if (anchor) {
			const A: TopoPoint = anchor.point.subtract([length / 2, 0]);
			const B: TopoPoint = anchor.point.add([length / 2, 0]);
			topoPath.add(A, B);
		}

		topoPath.visibility = false;

		// topoPath.strokeColor = new paper.Color("black")

		super(topoPath, anchor);

		this.setLength(length);

		this.configureAttractor();
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
		this.setOrientationDeterminator((pos: number) => {
			return pos > 0.25 && pos < 0.75;
		});
		this.setSpinDeterminator((pos: number) => {
			return pos > 0.25 && pos < 0.75;
		});
	}

	adjustToPosition() {
		if (this.determineOrientation(this.anchor.position)) {
			this.setAxisAngle(0);
		} else if (!this.determineOrientation(this.anchor.position)) {
			this.setAxisAngle(180);
		} else {
			throw new Error("POSSIBLY TRYING TO ANCHOR OUTSIDE OF FIELDs BOUNDS");
		}
	}

	adjustToSpin() {
		if (this.determineSpin(this.anchor.position)) {
			this.setSpin(1);
		} else if (!this.determineSpin(this.anchor.position)) {
			this.setSpin(-1);
		} else {
			throw new Error("POSSIBLY TRYING TO PLACE THE ATTRACTOR OUTSIDE OF FIELDs BOUNDS");
		}
	}

	adjustToPolarity() {
		// TODO

		this.setPolarity(1);
	}

	// at is provided by attractors that have paths that are non-linear ie. the input location doesn't match the mapped location.
	createAnchor({ point, tangent, normal, curveLength, pathLength, at }: TopoLocationData): HyperPoint {
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

	getTopoLocationAt(at: number): TopoLocationData {
		if (!this.topo) {
			throw new Error(`ERROR @Spine.getTopoLocationAt(${at}) ! Topo path is missing`);
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
}

export default OrbitalField;
