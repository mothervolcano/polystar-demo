import OrbitalField from "../attractors/orbitalField";
import Spine from "../attractors/spine";

import { pull } from "../../lib/topo/tools/stitcher";

import {
	normalize,
} from "../../lib/topo/utils/helpers";
import {
	convertToHyperPoint
} from "../../lib/topo/utils/converters";
import { TopoPath } from "../../lib/topo/drawing/paperjs";
import { HyperPoint, PointLike } from "../../lib/topo/topo";
import { Color } from "paper";


class Polystar {
	private _path: TopoPath;

	private _radius: number;
	private _position: HyperPoint;

	private _hasFill: boolean = false;
	private _color: paper.Color = new Color("#000000");

	constructor(radius: number, position: PointLike) {
		this._radius = radius;
		this._position = convertToHyperPoint(position);
		this._path = new TopoPath();
	}

	public configure(options: any) {
		this._hasFill = options.fill;
		this._color = new Color(options.color);
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

		const polyRadius = this._radius*2*Math.PI;
		const starRadius = polyRadius * Math.cos(Math.PI / sides);

		const polyField = new OrbitalField(polyRadius, this._position );
		const starField = new OrbitalField(starRadius, this._position );

		polyField.rotate(90)
		starField.rotate(90)

		const num = sideCtrl;
		const polySpineLength = this._radius/2;
		const starSpineLength = this._radius/2;

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

		starField.expandBy(starRadius * (expansionCtrl - 0.5) * 0.30, "RAY");

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

		this._path.reset();

		this._path.strokeColor = this._hasFill ? null : this._color;
		this._path.fillColor = this._hasFill ? this._color : null;


		for (let i = 0; i < num; i++) {
			// retract(polyPts[i]);
			this._path.add(polyPts[i]);

			// retract(starPts[i]);
			// starPts[i].steer(90).scaleHandles( curveCtrl );
			this._path.add(starPts[i]);
		}

		this._path.closed = true;
	}

	public getShapePath() {
		return this._path.getPaperPath();
	}
}

export default Polystar;
