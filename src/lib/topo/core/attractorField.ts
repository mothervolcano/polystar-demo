import { UnitIntervalNumber, PointLike, SizeLike } from '../types';

import DisplayNode from './displayNode';
import AttractorObject from './attractorObject';
import HyperPoint from './hyperPoint';


abstract class AttractorField extends DisplayNode {


	protected _attractor: any // TODO: cast type

	protected _orientation: number;
	protected _polarity: number;

	private _span: Array<number>;
	private _shift: number;
	
	private _axisAngle: number;
	

	constructor(  position: PointLike, size: SizeLike, orientation: number = 1, polarity: number = 1 ) {

		super( position, size )

		this._orientation = orientation;
		this._polarity = polarity;

		this._axisAngle = 0;

		this._span = [ 0, 1 ];
		this._shift = 0;

	}	

	get attractor() {

		return this._attractor;
	}

	get attractors() {

		return this.getChildren();
	}

	get firstAttractor() {

		return this.getFirstChild();
	}

	get lastAttractor() {

		return this.getLastChild();
	}

	set orientation( value: number ) {

		this.scale( value, 1 );
		this._orientation = value;
	}

	get orientation() {

		return this._orientation;
	}

	set polarity( value: number ) {

		this.scale( 1, value );
		this._polarity = value;
	}

	get polarity() {

		return this._polarity;
	}

	set axisAngle( value: number ) {

		this._axisAngle = value;
	}


	get axisAngle() {

		return this._axisAngle;
	}

	protected calculateOrientation( i: number, anchor: any ) {}
	protected calculatePolarity( i: number, anchor: any ) {}
	protected calculateRotation( attractor: any, anchor: any ) {}


	protected filterAttractors() {

		const attractors = this.getChildren()
			.filter( att => !att.isDisabled && !att.isSelfAnchored );

		return attractors;
	}


	protected arrangeAttractors( attractors: any[], pTest: boolean = false ) {


		const start = this._span[0]
		const end = this._span[1]

		const span = end - start

		let len = !this._attractor.path.closed || pTest ? attractors.length-1 : attractors.length;


		const step = span / ( Math.max( len, 1 ));

		for ( let i = 0; i < attractors.length; i++ ) {

			const attractor = attractors[i]

			const position = ( this._shift + start + step*i ) > 1  ? ( this._shift + start + step*i ) - 1 : ( this._shift + start + step*i );

			const anchor = attractor.isSelfAnchored ? this._attractor.locate( attractor.anchor.position ) : this._attractor.locate( position );

			attractor.reset();

			this.calculateOrientation( attractor, anchor );
			this.calculatePolarity( attractor, anchor );
			attractor.axisAngle = this.calculateRotation( attractor, anchor );	

			attractor.anchorAt( anchor );
		
		} 
	};

	public getAttractor( i?: number ): any {

		if ( i ) {

			return this.getChild( i );

		} else {

			return this._attractor;
		}

	};


	public locate( location: number, attractor: any = null, orient: boolean = false ): any {

		// -------------------------------------------------------
		// locate on a specified attractor
		
		if ( attractor instanceof AttractorObject ) {

			return attractor.locate( location )

		} else if ( typeof attractor === 'number' ) {

			return this.getChild( attractor ).locate( location, orient )

		// --------------------------------------------------------
		// if no attractor is specified then locate on all

		} else if ( attractor === undefined || attractor === null ) {

			const attractors = this.filterAttractors();
			const anchors = attractors
			  .filter( att => !att.isToSkip )
			  .map( att => att.locate( location, orient ) );

			// return _.flatten( anchors );
			return anchors.flat();
		}
	}

	// public addAttractor( attractor: any ): void {

	// 	this.add( attractor );

	// }

	public addAttractor( attractor: any, at?: number ): void {

		// super.addAttractor( attractor )

		this.add( attractor );

		// if ( attractor._dimension === null )  { attractor._dimension = this.getChildren().length }

		// ------------------------------------------------------------
		// 	

		if ( at ) {

			const anchor = this._attractor.locate( at );

			attractor.reset()
			attractor.isSelfAnchored = true;
			attractor.orientation = this.calculateOrientation( 0, anchor )
			attractor.polarity = this.calculatePolarity( 0, anchor );
			attractor.axisAngle = this.calculateRotation( attractor, anchor );
			attractor.anchorAt( anchor );
			
	
		// ------------------------------------------------------------
		// 

		} else {

			this.arrangeAttractors( this.filterAttractors() );
		}
	}

	public addAttractors( attractors: any ) {

		this.addMany( attractors );

		this.arrangeAttractors( attractors );
	}


	


	public anchorAt( anchor: HyperPoint, along: string = 'RAY' ) {

		// this._attractor._anchor = anchor;
		// this._attractor._anchor.spin = this._orientation;

		this._attractor.orientation = this.orientation;
		this._attractor.polarity = this.polarity;
		this._attractor.axisAngle = this.axisAngle;
		this._attractor.anchorAt( anchor, along );

		this.arrangeAttractors( this.filterAttractors() );

		// this.rotate( this.axisAngle );

		// this.placeAt( this._attractor._anchor.point, this._attractor._path.position );

	};


	public placeAt( position: any, pivot: any ): void {

		const iPos = this.position;

		super.placeAt( position, pivot );

		for ( const att of this.getChildren() ) {

			const pos = att.position.add( this.position.subtract(iPos) )

			att.placeAt( pos )
		}
	};


	public moveBy( by: number, along: any ) {

		this._attractor._anchor.offsetBy( by, along );

		this.placeAt( this._attractor._anchor.point, null );

		return this;
	};

	
	public scale( hor: number, ver: number, scaleField: boolean = false ): any {

		if ( scaleField ) {

			// TODO

		} else {

			for ( const att of this.filterAttractors() ) {

				att.scale( hor, ver );
				att.rotate( att.anchor.normal.angle );
			}
		}

		return this;
	};


	// Rotates the node together with its childs

	public rotate( angle: number ) {

		// if ( !this._attractor.isAxisLocked ) {

		// 	this._attractor._content.rotate( angle, this._attractor._anchor.point );
		// 	this._attractor.axisAngle += angle;
		// }

		this._attractor.rotate( angle );

		// const group = new Group();

		// group.addChild( this._content );

		// for ( const att of this.getChildren() ) {

		// 	group.addChild( att._content )
		// }

		// group.pivot = this._content.position;

		// group.rotate( angle )	
	}

	// Rotates the childs around the node

	public revolve( angle: number ) {

		const delta = angle; // TODO angles need to be normalized to 0... 1

		this._shift = delta;

		this.arrangeAttractors( this.filterAttractors() );

		return this;

	}

	public spin( angle: number ) {

		for ( const att of this.filterAttractors() ) {

			att.rotate( angle * att.orientation );
		}

		return this;
	}


	public fold( amount: any, alignAxis: boolean = true ) {

		// const start = this._span[0];
		// const end = this._span[1];		

		const start = this._span[0];
		const end = this._span[1];

		let factor = this.filterAttractors().length === 2 ? 3 : this.filterAttractors().length === 3 ? 2 : 1.5;

		if ( amount >= 0 ) {

			this._span = [ start+amount, end-amount*factor ];

		} else {

			this._span = [ end+amount, start-amount*factor ];
		}

		const attractors = this.filterAttractors().map( (att) => { att.isAxisLocked=!alignAxis; return att } );

		this.arrangeAttractors( attractors, true );

		return this;
	}



	public compress( start: any, end: any, alignAxis: boolean = true ) {

		this._span = [ start, end ];

		const attractors = this.filterAttractors().map( (att) => { att.isAxisLocked=!alignAxis; return att } );

		this.arrangeAttractors( attractors, true );

		return this;
	}


	public expandBy( by: any, along: string ) {

		for ( const att of this.filterAttractors() ) {

			att.moveBy( by, along );
		}

		return this;
	}

	public reset(): void {

		this._attractor.reset()

		this.render( null );
	}


	public remove(): void { 

		this._attractor.remove();
		super.clear();
	}
 
}


export default AttractorField;


