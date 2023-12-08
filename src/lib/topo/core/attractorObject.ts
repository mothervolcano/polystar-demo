import { IAttractor, IAttractorField, IHyperPoint, IPath, TopoLocationData, VectorDirection } from "../types";

abstract class AttractorObject {
	private _topo: IPath | null;
	private _anchor: IHyperPoint | null = null;
	private _field: IAttractorField | null = null;

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

	constructor(aTopo: IPath, aAnchor?: IHyperPoint) {
		this._topo = aTopo;
		this._anchor = aAnchor || null;
	}

	setTopo( aTopo: IPath ) {
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
 
	get anchor(): IHyperPoint {
		if (!this._anchor) {
			throw new Error(`Attractor is without anchor`);
		}

		return this._anchor;
	}

	get topo(): IPath {
		return this._topo;
	}

	get field(): IAttractorField | null {
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

	public addAttractor(aAttractor: IAttractor): IAttractor {
		throw new Error("addAttractor method is only available on AttractorFields");
	}

	public getAttractor(i: number): IAttractor {
		throw new Error("getAttractor method is only available on AttractorFields");
	}

	abstract anchorAt(aAnchor: IHyperPoint, along?: VectorDirection): void;

	setField(aAttractorField: IAttractorField): void {
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

	abstract update(anchor?: IHyperPoint): void;

	abstract adjustToPosition(): void;
	abstract adjustToSpin(): void;
	abstract adjustToPolarity(): void;

	abstract locate(at: number, orient?: boolean): IHyperPoint | IHyperPoint[];
	abstract getTopoLocationAt(at: number): TopoLocationData;
	abstract createAnchor(topoLocationData: TopoLocationData): IHyperPoint;

	// -----------------------------------------------------------------------------
	
	abstract draw(): void;
	abstract rotate(angle: number): void;

	// -----------------------------------------------------------------------------

	setAnchor(aAnchor?: IHyperPoint) {
		if (aAnchor) this._anchor = aAnchor;
	}
}

export default AttractorObject;
