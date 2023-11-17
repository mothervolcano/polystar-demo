import { PathLocationData, UnitIntervalNumber, IHyperPoint, PointLike, SizeLike } from '../../lib/topo/types';

import AttractorField from '../../lib/topo/core/attractorField';
import Spine from './spine';
import Orbital from './orbital';

import { isEven } from '../../lib/topo/utils/helpers';



class SpinalField extends AttractorField {

	private _positionData: any;

	private _length: number;
	private _mode: string;
	
	
	constructor( positionData: PointLike, length: number | null, orientation: number = 1, polarity: number = 1, mode: string = 'ALTERNATED' ) {

		const _path = Spine.project( positionData, length )

		super( _path.getPointAt( _path.length/2 ), _path.bounds.size, orientation, polarity )

		this._positionData = positionData;

		this._length = _path.length;
		this._mode = mode;

		this.render();

		return this;
	};


	protected render() {

		if ( this.isRendered ) {

			this._content.remove();
			this.isRendered = false;
		}

		this._attractor = new Spine( this._length, this._positionData );
		this._attractor.orientation = this.orientation;
		this._attractor.polarity = this.polarity;

		this.arrangeAttractors( this.filterAttractors() );

		super.render( this._attractor._content );

	};


	protected calculateOrientation( att: any, anchor: any ) {

		att.adjustToOrientation( anchor );

		// if ( isEven(i) ) {

		// 	return this.orientation;

		// } else {

		// 	return this._mode === 'DIRECTED' ? this.orientation : this.orientation * -1;
		// }
	};


	protected calculatePolarity( att: any, anchor: any ) {

		att.adjustToPolarity( anchor );
	};


	protected calculateRotation( i: number, anchor: any ) {

		if ( isEven(i) ) {

			return 0;

		} else {

			return this._mode === 'DIRECTED' ? 0 : 180;
		}
	};


	set mode( value: string ) {

		this._mode = value;
	};

	get mode() {

		return this._mode;
	};

	get length() {

		return this._length;
	};

}


export default SpinalField



