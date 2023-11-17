import { Path } from 'paper';

// import Path from '../drawing/path'


class DebugDot {

	private _dot: any

    constructor( pos: any, hex: any, r: number ) {

		const radius = r ? r : 5;
        const color = hex ? hex : '#10FF0C';

        this._dot = new Path.Circle({ 
            
            center: pos, 
            radius: radius,
            fillColor: color

        });

        return this._dot;
	}


    get dot() {

        return this._dot;
    }
}


export default DebugDot;
