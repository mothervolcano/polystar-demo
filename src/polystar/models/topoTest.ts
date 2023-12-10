import { Color } from "paper";

import { TopoPath } from "../../lib/topo/drawing/paperjs";

// import OrbitalField from "../attractors/orbitalField";
// import Spine from "../attractors/spine";

// import { pull } from "../../lib/topo/tools/stitcher";

import {
	normalize,
} from "../../lib/topo/utils/helpers";
import {
	convertToHyperPoint,
	convertToSegment,
} from "../../lib/topo/utils/converters";
import Spine from "../attractors/spine";
import { HyperPoint } from "../../lib/topo/topo";
import Orbital from "../attractors/orbital";
import OrbitalField from "../attractors/orbitalField";
import SpinalField from "../attractors/spinalField";


class TopoTest {
	private _path: any;

	private _radius: number;
	private _position: any;

	private _hasFill: boolean = false;
	private _color: string = "#000000";

	constructor(radius: number, position: any) {
		this._radius = radius;
		this._position = convertToHyperPoint(position);
	}

	public configure(options: any) {
		this._hasFill = options.fill;
		this._color = options.color;
	}

	public draw(params: any) {
		const {
			sideCtrl,
			expansionCtrl,
			twirlCtrl,
			tipRoundnessCtrl,
			joinRoundessCtrl,
			extendCtrl,
		} = params;

		const sides = sideCtrl;

		const polyRadius = this._radius;
		const starRadius = polyRadius * Math.cos(Math.PI / sides);
		
		const testOrbitalField = new OrbitalField(starRadius*2*Math.PI, this._position);
		const testSpinalField = new SpinalField(starRadius, this._position);

		const testSpine1 = new Spine(100, convertToHyperPoint([100, 25]));
		const testSpine2 = new Spine(100, convertToHyperPoint([100, 50]));
		const testSpine3 = new Spine(100, convertToHyperPoint([100, 75]));
		const testSpine4 = new Spine(100, convertToHyperPoint([100, 100]));
		const testSpine5 = new Spine(100, convertToHyperPoint([100, 125]));
		const testOrbital1 = new Orbital(50*2*Math.PI, convertToHyperPoint([250, 70]));
		const testOrbital2 = new Orbital(50*2*Math.PI, convertToHyperPoint([350, 70]));
		const testOrbital3 = new Orbital(50*2*Math.PI, convertToHyperPoint([450, 70]));
		const testOrbital4 = new Orbital(30*2*Math.PI, convertToHyperPoint([550, 70]));
		const testOrbital5 = new Orbital(30*2*Math.PI, convertToHyperPoint([625, 70]));

		// testOrbital1.moveBy(50, 'RAY')
		// testOrbital1.anchorAt(convertToHyperPoint([500, 500]))

		// testOrbitalField.addAttractor(testOrbital1);
		// testOrbitalField.addAttractor(testOrbital2);
		// testOrbitalField.addAttractor(testOrbital3);
		// testOrbitalField.addAttractor(testOrbital4);
		// testOrbitalField.addAttractor(testOrbital5);
		// testOrbitalField.addAttractor(testSpine1);
		// testOrbitalField.addAttractor(testSpine2);
		// testOrbitalField.addAttractor(testSpine3);
		// testOrbitalField.addAttractor(testSpine4);

		testOrbitalField.addAttractors([testSpine1,testSpine2, testSpine3])

		// testSpinalField.addAttractor(testOrbital)
		// testSpinalField.addAttractor(testSpine)

		const angleOffset = (180 / sides) * twirlCtrl;
		testOrbitalField.revolve(normalize(angleOffset, 0, 360));

		testOrbitalField.expandBy(starRadius * (expansionCtrl - 0.5) * 1.75, "RAY");

		const pts = testOrbitalField.locate(0.25);
		const pts2 = testOrbitalField.locate(0);


		for ( const pt of pts ) {

			new paper.Path.Circle({center: pt.point, radius: 3, fillColor: "green"})
		}

		for ( const pt of pts2 ) {

			new paper.Path.Circle({center: pt.point, radius: 3, fillColor: "red"})
		}

		// const polyField = new OrbitalField(this._position, polyRadius);
		// const starField = new OrbitalField(this._position, starRadius);

		// polyField.rotate(90)
		// starField.rotate(90)

		// const num = sideCtrl;
		// const polySpineLength = this._radius;
		// const starSpineLength = this._radius;

		// // ----------------------------------------------
		// //

		// const polySpines: any[] = [];

		// for (let i = 0; i < num; i++) {
		// 	polySpines.push(new Spine(polySpineLength));
		// }

		// polyField.addAttractors(polySpines);

		// // ----------------------------------------------
		// //

		// const starSpines: any[] = [];

		// for (let i = 0; i < num; i++) {
		// 	starSpines.push(new Spine(starSpineLength));
		// }

		// starField.addAttractors(starSpines);

		// // ----------------------------------------------
		// // TWIRL ACTION

		// const angleOffset = (180 / num) * twirlCtrl;
		// starField.revolve(normalize(angleOffset, 0, 360));

		// // ----------------------------------------------
		// // PULL <> PUSH ACTION

		// starField.expandBy(starRadius * (expansionCtrl - 0.5) * 1.75, "RAY");

		// // ----------------------------------------------
		// // TWEAK LENGTH ACTION

		// polyField.expandBy(polyRadius * extendCtrl, "RAY");

		
		// // ----------------------------------------------
		// // 


		// // ----------------------------------------------
		// // DRAW

		// const polyPts = polyField.locate(0.5);
		// const starPts = starField.locate(0.5);


		// // ----------------------------------------------
		// // TIP CURVATURE ACTION

		// const tipCurvature = this._radius/2 * tipRoundnessCtrl;

		// for ( const pt of polyPts ) {

		// 	pull(pt, tipCurvature);
		// 	pt.steer(90);
		// }

		// // ----------------------------------------------
		// // JOIN CURVATURE ACTION	

		// const joinCurvature = this._radius/2 * joinRoundessCtrl;

		// for ( const pt of starPts ) {

		// 	pull(pt, joinCurvature);
		// 	pt.steer(90);
		// }

		// this._path = new Path({
		// 	fillColor: this._hasFill ? this._color : null,
		// 	strokeColor: this._hasFill ? null : this._color,
		// 	closed: true,
		// });

		// for (let i = 0; i < num; i++) {
		// 	// retract(polyPts[i]);
		// 	this._path.add(convertToSegment(polyPts[i]));

		// 	// retract(starPts[i]);
		// 	// starPts[i].steer(90).scaleHandles( curveCtrl );
		// 	this._path.add(convertToSegment(starPts[i]));
		// }
	}

	public getShapePath() {
		return this._path;
	}
}

export default TopoTest;
