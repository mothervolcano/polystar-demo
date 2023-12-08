import { TopoPath } from "../drawing/paperjs";
import { IHyperPoint, IPath, IPoint, TopoLocationData, VectorDirection } from "../types";
import AttractorObject from "./attractorObject";

abstract class AttractorTopo extends AttractorObject {
	constructor(aTopo: IPath, anchor?: IHyperPoint) {
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

	anchorAt(anchor: IHyperPoint, along: VectorDirection = "RAY"): void {
		if (!this.topo) {
			throw new Error(`ERROR @AttractorTopo.anchorAt(...): Topo path is missing!`);
		}

		this.setAnchor(anchor);
		this.anchor.spin = this.spin;

		if (!this.axisLocked) {
			if (along === "TAN") {
				if (!anchor.tangent) {
					throw new Error("Attractor anchor missing tangent vector");
				}
				this.topo.rotation = anchor.tangent.angle;
			} else {
				if (!anchor.normal) {
					throw new Error("Attractor anchor missing normal vector");
				}
				this.topo.rotation = anchor.normal.angle;
			}
		}

		this.rotate(this.axisAngle);
		this.topo.placeAt(this.anchor.point, this.topo.position);
	}

	locate(at: number, orient: boolean = false): IHyperPoint {
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
		if (!this.topo) {
			throw new Error(`ERROR @AttractorObject.rotate(): path is missing!`);
		}

		if (!this.axisLocked) {
			this.topo.rotate(angle * this.spin, this.anchor.point);
			this.setAxisAngle(this.axisAngle + angle);
		}
	}
}

export default AttractorTopo;
