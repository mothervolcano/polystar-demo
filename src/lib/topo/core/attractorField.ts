import { IAttractor, IAttractorField, IHyperPoint, IPath, VectorDirection } from "../types";
import AttractorObject from "./attractorObject";

abstract class AttractorField extends AttractorObject {
	private _attractors: IAttractor[] = [];

	//--------------------------------
	// PROPERTIES

	private _span: [number, number] = [0, 1];
	private _shift: number = 0;

	constructor(topo: IPath, anchor?: IHyperPoint) {
		super(topo, anchor);

		return this;
	}

	public addAttractor(att: IAttractor, at?: number): IAttractor {
		this._attractors.push(att);

		att.setField(this);
		att.configureAttractor();
	
		if (at && typeof at === "number") {
			const anchor = this.locateOnSelf(at);

			att.setSelfAnchored(true);
			att.anchorAt(anchor);
		} else {
			this.update();
		}

		return att;
	}

	public addAttractors(attractors: IAttractor[]): void {
		this._attractors = [...this._attractors, ...attractors.map( (att) => {
			att.setField(this);
			att.configureAttractor();
			return att;
		})];

		this.update();
	}

	filterAttractors() {
		const attractors = this._attractors.filter((att) => !att.selfAnchored);
		return attractors;
	}

	update() {

		if (this.field) { // is it anchored on parent field?

			this.adjustToPosition();
			this.adjustToSpin();
			this.adjustToPolarity();

			this.rotate(this.axisAngle);
			this.topo.placeAt(this.anchor.point, this.topo.position);
		}


		const attractors = this.filterAttractors();
		
		const start = this._span[0];
		const end = this._span[1];

		const span = end - start;

		let len = !this.topo.closed ? attractors.length - 1 : attractors.length;

		const step = span / Math.max(len, 1);

		for (let i = 0; i < attractors.length; i++) {
			const attractor = attractors[i];

			const position =
				this._shift + start + step * i > 1
					? this._shift + start + step * i - 1
					: this._shift + start + step * i;

			const anchor = attractor.selfAnchored
				? this.locateOnSelf(attractor.anchor.position)
				: this.locateOnSelf(position);

			this.configureAttractor();
			attractor.update();
			attractor.anchorAt(anchor);
		}
	}

	getAttractor(i: number): IAttractor {
		return this._attractors[i];
	}

	anchorAt(anchor: IHyperPoint, along: VectorDirection = "RAY"): void {
		if (!this.topo) {
			throw new Error(`ERROR @AttractorTopo.anchorAt(...): path is missing!`);
		}

		this.setAnchor(anchor);
		this.anchor.spin = this.spin;

		if (!this.axisLocked) {
			if (along === "TAN") {
				if (!anchor.tangent) {
					throw new Error("Attractor anchor missing tangent vector");
				}

				// this._content.rotation = anchor.tangent.angle;
				this.topo.rotation = anchor.tangent.angle;
			} else {
				if (!anchor.normal) {
					throw new Error("Attractor anchor missing normal vector");
				}
				// this._content.rotation = anchor.normal.angle;
				this.topo.rotation = anchor.normal.angle;
			}
		}

		this.update();
	}


	locate(at: number, orient: boolean = false): IHyperPoint[] {
		const attractors = this.filterAttractors();
		const anchors = attractors.filter((att) => !att.skip).map((att) => att.locate(at, orient));

		// return _.flatten( anchors );
		return anchors.flat();
	}

	locateOn(iAttractor: number, at: number, orient: boolean = false): IHyperPoint {
		return this.getAttractor(iAttractor).locate(at, orient);
	}

	locateOnSelf(at: number, orient: boolean = false) {
		const locationData = this.getTopoLocationAt(at);

		if (locationData) {
			const pt = this.createAnchor(locationData);

			if (orient && this.spin === -1) {
				return pt.flip();
			}

			return pt;
		} else {
			throw new Error(`! ERROR @AttractorTopo.locate() : Unable to locate at ${at}`);
		}
	}

	rotate(angle: number) {

	}

	remove() {}
}

export default AttractorField;
