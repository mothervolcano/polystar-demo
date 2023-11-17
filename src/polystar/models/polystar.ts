import { Point, Path } from "paper";

import SpinalField from "../attractors/spinalField";
import OrbitalField from "../attractors/orbitalField";
import Spine from "../attractors/spine";
import Orbital from "../attractors/orbital";

import { curve, pull } from "../../lib/topo/tools/stitcher";

import {
	markPoint,
	traceSegment,
	genRandomDec,
	isEven,
	normalize,
} from "../../lib/topo/utils/helpers";
import {
	convertToHyperPoint,
	convertToSegment,
} from "../../lib/topo/utils/converters";
import { retract } from "../../lib/topo/tools/stitcher";

const DEBUG_GREEN = "#10FF0C";
const GUIDES = "#06E7EF";

class Polystar {
	private _path: any;

	private _radius: number;
	private _position: any;

	private _hasFill: boolean = false;
	private _color: string = "#10FF0C";

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
			shrinkCtrl,
		} = params;

		const sides = sideCtrl;

		const polyRadius = this._radius;
		const starRadius = polyRadius * Math.cos(Math.PI / sides);

		const polyField = new OrbitalField(this._position, polyRadius);
		const starField = new OrbitalField(this._position, starRadius);

		const num = sideCtrl;
		const polySpineLength = this._radius;
		const starSpineLength = this._radius;

		// ----------------------------------------------
		//

		const polySpines: any[] = [];

		for (let i = 0; i < num; i++) {
			polySpines.push(new Spine(polySpineLength));
		}

		polyField.addAttractors(polySpines);

		// ----------------------------------------------
		//

		const starSpines: any[] = [];

		for (let i = 0; i < num; i++) {
			starSpines.push(new Spine(starSpineLength));
		}

		starField.addAttractors(starSpines);

		// ----------------------------------------------
		// TWIRL ACTION

		const angleOffset = (180 / num) * twirlCtrl;
		starField.revolve(normalize(angleOffset, 0, 360));

		// ----------------------------------------------
		// PULL <> PUSH ACTION

		starField.expandBy(starRadius * (expansionCtrl - 0.5) * 1.75, "RAY");

		// ----------------------------------------------
		// TWEAK LENGTH ACTION

		polyField.expandBy(polyRadius * extendCtrl, "RAY");

		
		// ----------------------------------------------
		// 


		// ----------------------------------------------
		// DRAW

		const polyPts = polyField.locate(0.5);
		const starPts = starField.locate(0.5);


		// ----------------------------------------------
		// TIP CURVATURE ACTION

		const tipCurvature = this._radius/2 * tipRoundnessCtrl;

		for ( const pt of polyPts ) {

			pull(pt, tipCurvature);
			pt.steer(90);
		}

		// ----------------------------------------------
		// JOIN CURVATURE ACTION	

		const joinCurvature = this._radius/2 * joinRoundessCtrl;

		for ( const pt of starPts ) {

			pull(pt, joinCurvature);
			pt.steer(90);
		}

		this._path = new Path({
			fillColor: this._hasFill ? this._color : null,
			strokeColor: this._hasFill ? null : this._color,
			closed: true,
		});

		for (let i = 0; i < num; i++) {
			// retract(polyPts[i]);
			this._path.add(convertToSegment(polyPts[i]));

			// retract(starPts[i]);
			// starPts[i].steer(90).scaleHandles( curveCtrl );
			this._path.add(convertToSegment(starPts[i]));
		}

		// ----------------------------------------------
		//

		// this._path.rotate( 90, this._position.point );
	}

	public getShapePath() {
		return this._path;
	}
}

export default Polystar;
