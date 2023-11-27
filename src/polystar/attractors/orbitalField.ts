import { IHyperPoint, PointLike, SizeLike } from "../../lib/topo/types";

import { validatePointInput, validateSizeInput } from "../../lib/topo/utils/converters";
import AttractorField from "../../lib/topo/core/attractorField";
import Orbital from "./orbital";

import DebugDot from "../../lib/topo/utils/debugDot";

class OrbitalField extends AttractorField {
	constructor(
		position: IHyperPoint | null,
		radius: SizeLike | number,
		orientation: number = 1,
		polarity: number = 1,
	) {
		super(validatePointInput(position), validateSizeInput(radius), orientation, polarity);

		this.render();

		return this;
	}

	protected render() {
		if (this.isRendered) {
			this._content.remove();
			this.isRendered = false;
		}

		this._attractor = new Orbital(this.size, this.position);
		this._attractor.orientation = this._orientation;
		this._attractor.polarity = this._polarity;

		/*DEBUG*/
		// this._attractor.getPath().strokeColor = '#FFE44F';

		this.arrangeAttractors(this.filterAttractors());

		super.render(this._attractor._content);
	}

	// protected adjustRotationToPosition( position: number ) {

	// 	if ( position > 0.25 && position < 0.75 ) {

	// 		return 0;

	// 	} else {

	// 		return -180;
	// 	}
	// };

	protected calculateOrientation(att: any, anchor: IHyperPoint) {
		att.adjustToOrientation(anchor);
	}

	protected calculatePolarity(att: any, anchor: IHyperPoint) {
		att.adjustToPolarity(anchor);
	}

	protected calculateRotation(att: any, anchor: IHyperPoint) {
		// if ( anchor.position > 0.25 && anchor.position < 0.75 ) {

		// 	// axisAngle = anchor.normal.angle;
		// 	axisAngle = 0;

		// } else {

		// 	// axisAngle = anchor.normal.angle-180;
		// 	axisAngle = -180;
		// }

		return att.adjustRotationToPosition(anchor.position);
	}
}

export default OrbitalField;
