import { HyperPoint, TopoPoint, TopoLocationData, VectorDirection } from "../topo";
import { TopoPath } from "../drawing/paperjs";
import AttractorObject from "./attractorObject";

abstract class AttractorTopo extends AttractorObject {
	constructor(aTopo: TopoPath, anchor?: HyperPoint) {
		super(aTopo, anchor);

		return this;
	}

	update() {
		this.draw();
		
		if (this.field) {

			this.adjustToPosition();
			this.adjustToSpin();
			this.adjustToPolarity();
		}	
	}

	anchorAt(anchor: HyperPoint, along: VectorDirection = "RAY"): void {
		if (!this.topo) {
			throw new Error(`ERROR @AttractorTopo.anchorAt(...): Topo path is missing!`);
		}

		this.setAnchor(anchor);
		this.anchor.spin = this.spin;

		if (!this.axisLocked) {
			if (along === "TAN") {
				if (!anchor.getTangent()) {
					throw new Error("Attractor anchor missing tangent vector");
				}
				this.topo.rotation = anchor.getTangent().angle;
			} else {
				if (!anchor.getNormal()) {
					throw new Error("Attractor anchor missing normal vector");
				}
				this.topo.rotation = anchor.getNormal().angle;
			}
		}

		this.rotate(this.axisAngle);
		this.topo.placeAt(this.anchor.point, this.topo.position);
	}

	public locate(at: number, orient: boolean = false): HyperPoint {
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

	public scale( hor: number, ver: number ) {

		this.topo.scale( hor, ver );
		this.setLength(this.topo.length);

		return this;
	};

	public rotate(angle: number) {
		if (!this.topo) {
			throw new Error(`ERROR @AttractorObject.rotate(): path is missing!`);
		}

		if (!this.axisLocked) {
			this.topo.rotate(angle * this.spin, this.anchor.point);
			this.setAxisAngle(this.axisAngle + angle);
		}
	}

	public moveBy( by: number, along: VectorDirection ) {

		this.anchor.offsetBy( by, along );

		this.topo.placeAt( this.anchor.point );

		return this;
	};

	public remove() {

	}
}

export default AttractorTopo;
