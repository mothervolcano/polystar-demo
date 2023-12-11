import { TopoLocationData, VectorDirection, TopoPath, HyperPoint, AttractorField } from "../topo";

abstract class AttractorObject {
	private _topo: TopoPath;
	private _anchor: HyperPoint | null = null;
	private _field: AttractorField | null = null;

	//------------------------------------
	// PROPERTIES

	private _spin: number = 1;
	private _polarity: number = 1;

	private _length: number = 0;
	private _axisAngle: number = 0;

	private _axisLocked: boolean = false;
	private _selfAnchored: boolean = false;
	private _skip: boolean = false;

	//------------------------------------
	// 

	private _determineSpin: Function = () => {};
	private _determinePolarity: Function = () => {};
	private _determineOrientation: Function = () => {};

	constructor(aTopo: TopoPath, aAnchor?: HyperPoint) {
		this._topo = aTopo;
		this._anchor = aAnchor || null;
	}

	setTopo( aTopo: TopoPath ) {
		this._topo = aTopo;
	}

	get determineOrientation(): Function {
		return this._determineOrientation;
	}

	get determineSpin(): Function {
		return this._determineSpin;
	}

	get determinePolarity(): Function {
		return this._determinePolarity;
	}

	setOrientationDeterminator(fn: Function) {
		this._determineOrientation = fn;
	}

	setSpinDeterminator(fn: Function) {
		this._determineSpin = fn;
	}

	setPolarityDeterminator(fn: Function) {
		this._determinePolarity = fn;
	}
 
	get anchor(): HyperPoint {
		if (!this._anchor) {
			throw new Error(`ERROR @ AttractorObject.anchor: Attractor is without anchor`);
		}

		return this._anchor;
	}

	get topo(): TopoPath {
		return this._topo;
	}

	get field(): AttractorField | null {
		return this._field;
	}

	get spin(): number {
		return this._spin;
	}

	get polarity(): number {
		return this._polarity;
	}

	get length(): number {
		return this._length;
	}

	get axisAngle(): number {
		return this._axisAngle;
	}

	get axisLocked(): boolean {
		return this._axisLocked;
	}

	get selfAnchored(): boolean {
		return this._selfAnchored;
	}

	get skip(): boolean {
		return this._skip;
	}

	public addAttractor(aAttractor: AttractorObject): AttractorObject {
		throw new Error("addAttractor method is only available on AttractorFields");
	}

	public getAttractor(i: number): AttractorObject {
		throw new Error("getAttractor method is only available on AttractorFields");
	}

	abstract anchorAt(aAnchor: HyperPoint, along?: VectorDirection): void;

	setField(aAttractorField: AttractorField): void {
		this._field = aAttractorField;
	}

	setSpin(value: number) {
		this._spin = value;
	}

	setPolarity(value: number) {
		this._polarity = value;
	}

	setLength(value: number) {
		this._length = value;
	}

	setAxisAngle(angle: number): void {
		this._axisAngle = angle;
	}

	setAxisLocked(value: boolean): void {
		this._axisLocked = value;
	}

	setSelfAnchored(value: boolean): void {
		this._selfAnchored = value;
	}

	setSkip(value: boolean): void {
		this._skip = value;
	}

	// -----------------------------------------------------
	// Implemented by the abstract sub-classes

	abstract update(anchor?: HyperPoint): void;
	abstract configureAttractor(): void;
	public abstract locate(at: number, orient?: boolean): HyperPoint | HyperPoint[];
	public abstract rotate(angle: number): void;
	public abstract moveBy( by: number, along: VectorDirection): void
	public abstract scale( hor: number, ver: number ): void
	public abstract remove(): void;
	
	// -----------------------------------------------------
	// Implemented by the concrete sub-classes

	protected abstract getTopoLocationAt(at: number): TopoLocationData;
	protected abstract createAnchor(topoLocationData: TopoLocationData): HyperPoint;	
	protected abstract adjustToPosition(): void;
	protected abstract adjustToSpin(): void;
	protected abstract adjustToPolarity(): void;
	protected abstract draw(): void;
	protected setAnchor(aAnchor?: HyperPoint) {
		if (aAnchor) this._anchor = aAnchor;
	}
}

export default AttractorObject;
