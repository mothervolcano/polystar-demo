import { TopoPath, HyperPoint, VectorDirection, AttractorTopo } from "../topo";
import AttractorObject from "./attractorObject";

abstract class AttractorField extends AttractorObject {
	private _attractors: AttractorObject[] = [];

	//--------------------------------
	// PROPERTIES

	private _span: [number, number] = [0, 1];
	private _shift: number = 0;

	constructor(topo: TopoPath, anchor?: HyperPoint) {
		super(topo, anchor);

		return this;
	}

	update() {
		if (this.field) {
			// is it anchored on parent field?

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

	anchorAt(anchor: HyperPoint, along: VectorDirection = "RAY"): void {
		if (!this.topo) {
			throw new Error(`ERROR @AttractorTopo.anchorAt(...): path is missing!`);
		}

		this.setAnchor(anchor);
		this.anchor.spin = this.spin;

		if (!this.axisLocked) {
			if (along === "TAN") {
				if (!anchor.getTangent()) {
					throw new Error("Attractor anchor missing tangent vector");
				}

				// this._content.rotation = anchor.tangent.angle;
				this.topo.rotation = anchor.getTangent().angle;
			} else {
				if (!anchor.getNormal()) {
					throw new Error("Attractor anchor missing normal vector");
				}
				// this._content.rotation = anchor.normal.angle;
				this.topo.rotation = anchor.getNormal().angle;
			}
		}

		this.update();
	}

	private filterAttractors() {
		const attractors = this._attractors.filter((att) => !att.selfAnchored);
		return attractors;
	}

	public addAttractor(att: AttractorObject, at?: number): AttractorObject {
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

	public addAttractors(attractors: AttractorObject[]): void {
		this._attractors = [
			...this._attractors,
			...attractors.map((att) => {
				att.setField(this);
				att.configureAttractor();
				return att;
			}),
		];

		this.update();
	}

	public getAttractor(i: number): AttractorObject {
		return this._attractors[i];
	}

	public locate(at: number, orient: boolean = false): HyperPoint[] {
		const attractors = this.filterAttractors();
		const anchors = attractors.filter((att) => !att.skip).map((att) => att.locate(at, orient));

		// return _.flatten( anchors );
		return anchors.flat();
	}

	public locateOn(iAttractor: number, at: number, orient: boolean = false): HyperPoint | HyperPoint[] {
		return this.getAttractor(iAttractor).locate(at, orient);
	}

	public locateOnSelf(at: number, orient: boolean = false): HyperPoint {
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

	public scale(hor: number, ver: number) {
		for (const att of this.filterAttractors()) {
			att.scale(hor, ver);
		}

		this.topo.scale(hor, ver);
		this.setLength(this.topo.length);

		this.update();

		return this;
	}

	public rotate(angle: number) {
		for (const att of this.filterAttractors()) {
			att.rotate(angle * att.spin);
		}

		if (!this.axisLocked) {
			this.topo.rotate(angle * this.spin, this.anchor.point);
			this.setAxisAngle(this.axisAngle + angle);
		}

		this.update();

		return this;
	}

	public moveBy(by: number, along: VectorDirection) {
		this.anchor.offsetBy(by, along);

		this.topo.placeAt(this.anchor.point);

		return this;
	}

	public revolve(angle: number) {
		const delta = angle; // TODO angles need to be normalized to 0... 1

		this._shift = delta;

		this.update();

		return this;
	}

	public compress(start: number, end: number, alignAxis: boolean = true) {
		this._span = [start, end];

		const attractors = this.filterAttractors().map((att) => {
			att.setAxisLocked(alignAxis);
			return att;
		});

		this.update();

		return this;
	}

	public expandBy(by: number, along: VectorDirection) {
		for (const att of this.filterAttractors()) {
			att.moveBy(by, along);
		}

		return this;
	}

	public remove() {}
}

export default AttractorField;
