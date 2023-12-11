import { TopoLocationData, HyperPoint as HyperPointType } from "../../lib/topo/topo";
import HyperPoint from "../../lib/topo/core/hyperPoint";
import AttractorField from "../../lib/topo/core/attractorField";
import { TopoPoint, TopoPath } from "../../lib/topo/drawing/paperjs";

class OrbitalField extends AttractorField {
	constructor(length: number, anchor?: HyperPointType) {
		const topoPath = new TopoPath();

		super(topoPath, anchor);
		this.setLength(length);
		this.draw();

		this.configureAttractor();
	}

	protected draw() {

		if (this.anchor) {

			this.topo.reset();
			this.topo.visibility = true;

			this.topo.createCircle(this.anchor, this.length/Math.PI/2);
			this.topo.strokeColor = new paper.Color("orange");
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

	protected adjustToPosition() {
		if (this.determineOrientation(this.anchor.position)) {
			this.setAxisAngle(0);
		} else if (!this.determineOrientation(this.anchor.position)) {
			this.setAxisAngle(180);
		} else {
			throw new Error("POSSIBLY TRYING TO ANCHOR OUTSIDE OF FIELDs BOUNDS");
		}
	}

	protected adjustToSpin() {
		if (this.determineSpin(this.anchor.position)) {
			this.setSpin(1);
		} else if (!this.determineSpin(this.anchor.position)) {
			this.setSpin(-1);
		} else {
			throw new Error("POSSIBLY TRYING TO PLACE THE ATTRACTOR OUTSIDE OF FIELDs BOUNDS");
		}
	}

	protected adjustToPolarity() {
		// TODO

		this.setPolarity(1);
	}

	// at is provided by attractors that have paths that are non-linear ie. the input location doesn't match the mapped location.
	createAnchor({ point, tangent, normal, curveLength, pathLength, at }: TopoLocationData): HyperPointType {
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

	protected getTopoLocationAt(at: number): TopoLocationData {
		if (!this.topo) {
			throw new Error(`ERROR @Spine.getTopoLocationAt(${at}) ! Topo path is missing`);
		}

		const loc = this.topo.getLocationAt(this.topo.length * at);

		return {
			...loc,
			at: at,
		};
	}
}

export default OrbitalField;
