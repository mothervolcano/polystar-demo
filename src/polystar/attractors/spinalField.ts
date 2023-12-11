import { TopoPoint as TopoPointType, TopoLocationData, HyperPoint as HyperPointType } from "../../lib/topo/topo";
import HyperPoint from "../../lib/topo/core/hyperPoint";
import AttractorField from "../../lib/topo/core/attractorField";
import { TopoPath } from "../../lib/topo/drawing/paperjs";
import { TopoPoint } from '../../lib/topo/drawing/paperjs';

class SpinalField extends AttractorField {
	private _alternator: boolean = false;
	private _mode: string;

	constructor(length: number, anchor?: HyperPointType, mode: string = "DIRECTED") {
		const topoPath = new TopoPath();

		super(topoPath, anchor);
		this.setLength(length);
		this.draw();

		this._mode = mode;

		this.configureAttractor();
	}

	private alternate() {
		this._alternator = !this._alternator;
	}

	protected draw() {

		if (this.anchor) {

			this.topo.reset();
			const A: TopoPointType = this.anchor.point.subtract([this.length/2, 0]);
			const B: TopoPointType = this.anchor.point.add([this.length/2, 0]);
			this.topo.add(A,B);

			this.topo.visibility = false;

			// this.topo.strokeColor = new paper.Color("orange");
		}
	}

	configureAttractor() {
		switch (this._mode) {
			case "SYMMETRICAL":
				this.setOrientationDeterminator((pos: number) => {
					return pos < 0.5;
				});
				this.setSpinDeterminator((pos: number) => {
					return pos < 0.5;
				});
				break;

			case "ALTERNATED": // TODO: need to know the order of each att
				this.alternate();
				this.setOrientationDeterminator((pos: number) => {
					return !this._alternator;
				});
				this.setSpinDeterminator((pos: number) => {
					return this._alternator;
				});

				break;

			case "DIRECTED":
				this.setOrientationDeterminator((pos: number) => {
					return pos >= 0;
				});
				this.setSpinDeterminator((pos: number) => {
					return pos >= 0;
				});
				break;
		}
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

export default SpinalField;