import { Point } from 'paper';

import HyperPoint from '../core/hyperPoint';

import { convertToHyperPoint, convertToPoint, convertToSegment } from '../utils/converters'
import { to360, degToRad, radToDeg, markPoint } from '../utils/helpers'


export function measure( hpt1: any, hpt2: any, ratio: number = 1 ) {

	const A = convertToPoint( hpt1 );
	const B = convertToPoint( hpt2 );

	return A.getDistance(B) * ratio;
}


export function merge( hpt1: any, hpt2: any ) {

	const hpt = new HyperPoint( hpt1.point, hpt1.handleIn, hpt2.handleOut );

	hpt.position = hpt1.position;
	hpt.tangent = hpt1.tangent;
	hpt.normal = hpt1.normal;
	hpt.spin = hpt1.spin;
	hpt.polarity = hpt1.polarity;

	return hpt;
}

export function pull( hpt: any, length: number ) {

	hpt.handleIn.length = length;
	hpt.handleOut.length = length;
}

export function breakOut( hpt: any, angle: number ) {

	hpt.handleOut.angle += angle;
}

export function breakIn( hpt: any, angle: number ) {

	hpt.handleIn.angle += angle;
}

export function iron( hpt1: any, hpt2: any ) {

	hpt1.handleOut = null;
	hpt2.handleIn = null;
}

export function retract( hpt: any ) {

	hpt.handleIn.length = 0;
	hpt.handleOut.length = 0;
}

export function ortoAlign( hpt: any, along: string ) {

	if ( along === 'HOR' ) {

		hpt.handleIn.angle = 180;
		hpt.handleOut.angle = 0;

		return hpt;
	}

	if ( along === 'VER' ) {

		hpt.handleIn.angle = -90;
		hpt.handleOut.angle = 90;

		return hpt;
	}

}


export function mirror( hpt: any, angle: number ) {

	hpt.handleIn.angle = angle - ( hpt.handleOut.angle - angle );
}


export function budge( hpt1: any, hpt2: any, angle: number ) {

	hpt1.handleOut.angle += angle;
	hpt2.handleIn.angle -= angle;
}


// TODO: deprecated. use clap instead;
export function bounce( hpt: any ) {

	hpt.handleOut = hpt.handleIn;

	return hpt;
}

export function clap( hpt: any ) {

	hpt.handleOut = hpt.handleIn;

	return hpt;
}


export function tie( hpt1: any, hpt2: any, ratio: number = 1 ) {

	hpt1.handleIn.length = hpt2.handleIn.length * ratio;
	hpt1.handleOut.length = hpt2.handleOut.length * ratio;
}

export function lock( hpt1: any, hpt2: any, ratio: number = 1 ) {

	hpt1.handleOut.length = hpt2.handleIn.length * ratio;
}

export function mid( hpt1: any, hpt2: any ) {

	const A = convertToPoint( hpt1 );
	const B = convertToPoint( hpt2 );

	const _P = A.add( new Point( ( B.x - A.x )/2, ( B.y-A.y )/2 ) );
	
	const P = convertToHyperPoint( _P );

	P.tangent = new Point( ( B.x - _P.x )/3, ( B.y - _P.y )/3 );
	P.tangent.normalize();
	P.normal = P.tangent.rotate( -90 );
	P.normal.normalize();
	
	P.handleIn 	= 	new Point( ( A.x - _P.x )/3, ( A.y - _P.y )/3 );
	P.handleOut = 	new Point( ( B.x - _P.x )/3, ( B.y - _P.y )/3 );

	return P;
}


export function curve( A: any, B: any, lA: number = 2/3, lB: number = 2/3 ) {

	const _A = convertToSegment( A );
	const _B = convertToSegment( B );

	const t = 0.5;
	const height = 1/3;

	const a = _B.point.subtract( _A.point ).angle;
	const d = _A.point.getDistance( _B.point );

	if ( !_A.handleOut.isZero() )
	{
		if ( !_B.handleIn.isZero() )
		{
			// console.log("A: has handles / B: has handles")

			let aAOut = to360( _A.handleOut.angle ) - to360( a )
			let aBIn = to360( _A.point.subtract( _B.point ).angle ) - to360( _B.handleIn.angle )

			let aC = 180 - aAOut - aBIn

            let hA_MaxLen = Math.abs( d/Math.sin(degToRad( aC )) * Math.sin(degToRad( aBIn )))
            let hB_MaxLen = Math.abs( d/Math.sin(degToRad( aC )) * Math.sin(degToRad( aAOut )))

            let hA_len = Math.abs( Math.cos( degToRad( aAOut ) ) * hA_MaxLen ) 
            let hB_len = Math.abs( Math.cos( degToRad( aBIn ) ) * hB_MaxLen ) 

            if ( hA_len > d ) { hA_len = d }
            if ( hB_len > d ) { hB_len = d }

            _A.handleOut.length = hA_len * lA//+1/3
            _B.handleIn.length = hB_len * lB//-1/3

		} else {
        	
        	// console.log( "A: has handles / B: no handles" )

            // let aAOut = to360( A.handleOut.angle ) - to360( a )
            // let hA_MaxLen = Math.abs( d*t / Math.cos(degToRad( aAOut )))

            let aAOut = _A.handleOut.angle - a
            
            let aA_len = d*t

            _A.handleOut.length = aA_len*lA

            // the angle for the B handle is a function of A handle
            let h = Math.tan( degToRad( aAOut )) * d*t
            let aBIn = radToDeg( Math.atan( h / ( d - d*t ) ) )
            // let hB_MaxLen = Math.abs( (d-d*t) / Math.cos( degToRad( aBIn ) ) )

            let aB_len = d - d*t

            // console.log("!! " + ( aAOut ) )

            let vhBa = Math.abs( aAOut ) < 90 ? ( a - aBIn - 180 ) : 90*(aAOut/aAOut)

            let vhB = new Point({ angle: vhBa, length: 1 })
            
            _B.handleIn = vhB.multiply( aB_len * lB )
		}

	} else if ( !_B.handleIn.isZero() ) {
            
        // console.log("A: no handles / B: has handles")

        let aBIn =  to360( _A.point.subtract( _B.point ).angle ) - to360( _B.handleIn.angle )
        let hB_MaxLen = Math.abs( (d - d*t) / Math.cos(degToRad( aBIn )))
        _B.handleIn.length = hB_MaxLen * lB

        // the angle for the A handle is a function of B handle
        let h = Math.tan( degToRad( aBIn ))*( d - d*t)
        let aAOut = radToDeg( Math.atan( h / ( d*t ) ) )
        // let hA_MaxLen = (d*t) / Math.cos(degToRad(aAOut))
        let hA_MaxLen = Math.abs((d*t) / Math.cos(degToRad(aAOut)) )

        let vhA = new Point({angle: a + to360(aAOut), length: 1})
        _A.handleOut = vhA.multiply( hA_MaxLen*lA )

	} else {
        
        // console.log("A: no handles / B: no handles")

		let h = height || 1/3;	
        
        let vAB = new Point({ angle: a, length: d*t });
        let nAB = new Point({ angle: a-90, length: d*h });

        let pN = _A.point.add(vAB).add(nAB) //*_orientation; //calculate the normal for the curve peak

        let vhA = new Point( {angle: pN.subtract(_A.point).angle, length: _A.point.getDistance(pN)*lA} )
        let vhB = new Point( {angle: pN.subtract(_B.point).angle, length: _B.point.getDistance(pN)*lB} )

        _A.handleOut = vhA
        _B.handleIn = vhB
	}

	// 

	A.handleOut = _A.handleOut;
	B.handleIn = _B.handleIn;

};
