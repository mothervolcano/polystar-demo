import { VectorDirection, PointLike } from "../topo";
import { validatePointInput } from "../utils/converters";

import { TopoPoint } from "../drawing/paperjs";

class HyperPoint {
	private _point: TopoPoint;
	private _handleIn: TopoPoint;
	private _handleOut: TopoPoint;

	private _position: number;
	private _spin: number;
	private _polarity: number;

	private AXIS: { TAN: TopoPoint; RAY: TopoPoint; VER: TopoPoint; HOR: TopoPoint } = {
		TAN: new TopoPoint(0, 0),
		RAY: new TopoPoint(0, 0),
		VER: new TopoPoint(0, 0),
		HOR: new TopoPoint(0, 0),
	};

	// private _debugPath1: any
	// private _debugPath2: any
	// private _debugDot1: any
	// private _debugDot2: any

	// private _debugGuides: any;

	/**
	 * Creates a new HyperPoint instance.
	 */

	constructor(point: PointLike, handleIn: PointLike = { x: 0, y: 0 }, handleOut: PointLike = {x: 0, y: 0}) {
		this._point = validatePointInput(point);
		this._handleIn = validatePointInput(handleIn);
		this._handleOut = validatePointInput(handleOut);

		this._spin = 1;
		this._polarity = 1;

		this._position = 0;

		/* DEBUG */
		// this._debugGuides = [];

		// this._debugPath1 = new Path()
		// this._debugPath2 = new Path()
		// this._debugDot1 = new Path()
		// this._debugDot2 = new Path()

		return this;
	}

	set position(value: number) {
		this._position = value;
	}

	get position() {
		return this._position;
	}

	get x() {
		return this._point.x;
	}

	get y() {
		return this._point.y;
	}

	get point() {
		return this._point;
	}

	get handleIn() {
		return this._handleIn;
	}

	get handleOut() {
		return this._handleOut;
	}

	set handleIn(pt: TopoPoint) {
		this._handleIn = pt;
	}

	set handleOut(pt: TopoPoint) {
		this._handleOut = pt;
	}

	// ---------------------------------------------------------
	//

	set spin(value: number) {
		this._spin = value;

		let a = value === 1 ? 0 : 180;

		this.AXIS.HOR = new TopoPoint({ angle: a, length: 1 });
		this.AXIS.VER = new TopoPoint({ angle: 90, length: 1 });

		this.AXIS.TAN = this.AXIS.TAN.multiply(this._spin);
	}

	set polarity(value: number) {
		this._polarity = value;

		if (this.AXIS.RAY !== null) {
			this.AXIS.RAY.multiply(this._polarity);
		}
	}

	get spin() {
		return this._spin;
	}

	get polarity() {
		return this._polarity;
	}

	setTangent(point: TopoPoint) {
		this.AXIS.TAN = point.normalize();
		// this.AXIS.TAN = this._spin === -1 ? point : point.multiply(this._spin);

		// this._handleOut = this.AXIS.TAN
		// this._handleIn = this.AXIS.TAN * -1
	}

	getTangent(): TopoPoint {
		return this.AXIS.TAN;
	}

	setNormal(point: TopoPoint) {
		this.AXIS.RAY = point.normalize();
		// this.AXIS.RAY = this._spin === -1 ? point.multiply(this._spin) : point;

		// this.AXIS.RAY = point.multiply(-1)
	}

	getNormal(): TopoPoint {
		return this.AXIS.RAY;
	}

	public flip(): HyperPoint {
		[this._handleIn, this._handleOut] = [this._handleOut, this._handleIn];

		return this;
	}

	public offsetBy(by: number, along: VectorDirection): HyperPoint {
		const d = by * this._polarity;
		const v = this.AXIS[along];

		// /* DEBUG */ const debugPath = new Path({
		// 	segments: [this._point],
		// 	strokeColor: "#FFAE29",
		// });

		this._point = this._point.add(v.multiply(d));

		// /* DEBUG */  debugPath.add( this._point );
		// /* DEBUG */  const debugDot = new Circle( this._point, 2) // orange

		// this._debugGuides.addChildren( [ debugPath, debugDot ] )

		return this;
	}

	public steer(tilt: number, aperture: number = 180, hScale: number = 1): HyperPoint {
		const axis = this.AXIS.RAY.angle + tilt * this._spin;

		this._handleOut = new TopoPoint({
			angle: axis + (aperture / 2) * this._spin,
			length: this._handleOut.length * hScale,
		});

		this._handleIn = new TopoPoint({
			angle: axis - (aperture / 2) * this._spin,
			length: this._handleIn.length * hScale,
		});

		this.AXIS.TAN = this._handleOut;
		this.AXIS.RAY = this.AXIS.TAN.rotate(-90, this.point);
		this.AXIS.TAN.normalize();
		this.AXIS.RAY.normalize();

		// this._handleOut.angle += ( tilt )
		// this._handleIn.angle += ( tilt )

		/* DEBUG */

		// const _debugPath1 = new Path({segments: [this._point, this._point.add(this._handleOut.multiply(1))], strokeColor: '#02B7FD'})
		// const _debugPath2 = new Path({segments: [this._point, this._point.add(this._handleIn.multiply(1))], strokeColor: '#02B7FD'})
		// const _debugDot1 = new Circle(this._point.add(this._handleOut.multiply(1)), 2) // orange
		// const _debugDot2 = new Circle(this._point.add(this._handleIn.multiply(1)), 2) // yellow

		// this._debugGuides.addChildren( [ _debugPath1, _debugPath2, _debugDot1, _debugDot2 ] );

		/* */

		return this;
	}

	public clone(): HyperPoint {
		const _clone = new HyperPoint(
			this._point.clone(),
			this._handleIn = this._handleIn.clone(),
			this._handleOut = this._handleOut.clone()
		);

		_clone.position = this._position;
		_clone.spin = this._spin;

		_clone.AXIS = {
			TAN: this.AXIS.TAN.clone(),
			RAY: this.AXIS.RAY.clone(),
			VER: this.AXIS.VER.clone(),
			HOR: this.AXIS.HOR.clone(),
		};

		return _clone;
	}
}

export default HyperPoint;
