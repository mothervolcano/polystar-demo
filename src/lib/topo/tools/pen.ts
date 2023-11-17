import { Point, Segment } from 'paper';

import HyperPoint from '../core/hyperPoint';

import { degToRad, radToDeg, to360 } from '../utils/helpers'


class Pen {

	private static instance = new Pen();
	
	private path: any
	private A: any
	private B: any

	private constructor() {

		this.path = null;
		this.A = null; // TODO: cast as segment
		this.B = null; // TODO: cast as segment

	}


	public static getInstance() {

		return this.instance;
	}


	private reset() {

		this.path = null;
		this.A = null;
		this.B = null;
	}


	private stitch( hpt: any ) {

		if ( this.path.lastSegment && this.path.lastSegment.point.isClose( hpt.point, 1) ) {

			this.path.lastSegment.handleOut = hpt.getSegment().handleOut

			return true

		} else {

			return false
		}

	}

	// t: curve axis
	// height: curve height;
	// lA: A handleOut length factor;
	// lB: B handleIn length factor;

	private plotCurve( t:number, height: number, lA:number, lB:number ) {

		const a = this.B.point.subtract( this.A.point ).angle;
		const d = this.A.point.getDistance( this.B.point );

		if ( !this.A.handleOut.isZero() )
		{
			if ( !this.B.handleIn.isZero() )
			{
				// console.log("A: has handles / B: has handles")

				let aAOut = to360( this.A.handleOut.angle ) - to360( a )
				let aBIn = to360( this.A.point.subtract( this.B.point ).angle ) - to360( this.B.handleIn.angle )

				let aC = 180 - aAOut - aBIn

                let hA_MaxLen = Math.abs( d/Math.sin(degToRad( aC )) * Math.sin(degToRad( aBIn )))
                let hB_MaxLen = Math.abs( d/Math.sin(degToRad( aC )) * Math.sin(degToRad( aAOut )))

                let hA_len = Math.abs( Math.cos( degToRad( aAOut ) ) * hA_MaxLen ) 
                let hB_len = Math.abs( Math.cos( degToRad( aBIn ) ) * hB_MaxLen ) 

                if ( hA_len > d ) { hA_len = d }
                if ( hB_len > d ) { hB_len = d }

                this.A.handleOut.length = hA_len * lA//+1/3
                this.B.handleIn.length = hB_len * lB//-1/3

			} else {
            	
            	// console.log( "A: has handles / B: no handles" )

	            // let aAOut = to360( A.handleOut.angle ) - to360( a )
                // let hA_MaxLen = Math.abs( d*t / Math.cos(degToRad( aAOut )))

                let aAOut = this.A.handleOut.angle - a
                
                let aA_len = d*t

                this.A.handleOut.length = aA_len*lA

                // the angle for the B handle is a function of A handle
                let h = Math.tan( degToRad( aAOut )) * d*t
                let aBIn = radToDeg( Math.atan( h / ( d - d*t ) ) )
                // let hB_MaxLen = Math.abs( (d-d*t) / Math.cos( degToRad( aBIn ) ) )

                let aB_len = d - d*t

                // console.log("!! " + ( aAOut ) )

                let vhBa = Math.abs( aAOut ) < 90 ? ( a - aBIn - 180 ) : 90*(aAOut/aAOut)
 
                let vhB = new Point({ angle: vhBa, length: 1 })
                
                this.B.handleIn = vhB.multiply( aB_len * lB )
			}

		} else if ( !this.B.handleIn.isZero() ) {
                
            // console.log("A: no handles / B: has handles")

            let aBIn =  to360( this.A.point.subtract( this.B.point ).angle ) - to360( this.B.handleIn.angle )
            let hB_MaxLen = Math.abs( (d - d*t) / Math.cos(degToRad( aBIn )))
            this.B.handleIn.length = hB_MaxLen * lB

            // the angle for the A handle is a function of B handle
            let h = Math.tan( degToRad( aBIn ))*( d - d*t)
            let aAOut = radToDeg( Math.atan( h / ( d*t ) ) )
            // let hA_MaxLen = (d*t) / Math.cos(degToRad(aAOut))
            let hA_MaxLen = Math.abs((d*t) / Math.cos(degToRad(aAOut)) )

            let vhA = new Point({angle: a + to360(aAOut), length: 1})
            this.A.handleOut = vhA.multiply( hA_MaxLen*lA )

		} else {
            
            // console.log("A: no handles / B: no handles")

			let h = height || 1/3;	
            
            let vAB = new Point({ angle: a, length: d*t });
            let nAB = new Point({ angle: a-90, length: d*h });

            let pN = this.A.point.add(vAB).add(nAB) //*this.orientation; //calculate the normal for the curve peak

            let vhA = new Point( {angle: pN.subtract(this.A.point).angle, length: this.A.point.getDistance(pN)*lA} )
            let vhB = new Point( {angle: pN.subtract(this.B.point).angle, length: this.B.point.getDistance(pN)*lB} )

            this.A.handleOut = vhA
            this.B.handleIn = vhB
		}
	};


	private plotFlowCurve( lA: number, lB: number ) {

		const a = this.B.point.subtract(this.A.point).angle;
		const d = this.A.point.getDistance(this.B.point);

		let l;
		let vhA;

		if ( this.A.curve && this.A.handleOut.isZero() ) {

			// vhA = new Point( { angle: A.curve.getTangentAtTime(1).angle, length: 1 } )
			// l = !A.handleIn.isZero() ? A.handleIn.length/A.curve.length : 1/3

			// A.handleOut = vhA.multiply(d).multiply(l).multiply(lA)

			l = 1/3;

		} else {

			if ( !this.A.handleOut.isZero() ) {

				vhA = new Point( { angle: this.A.handleOut.angle, length: 1 } );
				l = 1/3;

				this.A.handleOut = vhA.multiply( d ).multiply( l ).multiply( lA );

			} else {

				l = 1/3;
			}
		}

		let vhB

		if ( this.B.curve ) {

			vhB = new Point( { angle: this.B.curve.getTangentAtTime(this.B.curve.getTimeOf(this.B.point)).angle, length: 1 } );

			this.B.handleIn = vhB.multiply(d).multiply(l).multiply(lB);

		} else {

            if ( !this.B.handleIn.isZero() ) {

            	vhB = new Point({angle: this.B.handleIn.angle, length: 1});

            	this.B.handleIn = vhB.multiply(d).multiply(l).multiply(lB);

            }

            // if ( A.handleOut.isZero() )
            // {
            // 	vhA = new Point({angle: B.handleIn.angle-180-(B.handleIn.angle-a)*2, length: 1})

            // 	A.handleOut = vhA.multiply(d).multiply(l).multiply(lA)
            // }
		}
	};


	public setPath( p: any ) {

		this.reset();
		this.path = p;
	};


	public getPath() {

		return this.path;
	};


	public add( input: any ) {


		if ( input instanceof HyperPoint ) {

			if ( !this.stitch( input ) ) { this.path.add( input.getSegment() ) }
		}

		if ( Array.isArray( input ) ) {

			for ( const hpt of input ) {

				if ( !this.stitch( hpt ) ) { this.path.add( hpt.getSegment() ) }
			}
		}

	};


	public addCurveTo( input: any, handlesLength: any, hasABhandles: number | Array<number>, curveAxis: number, curveHeight: number ) {


		const axis = curveAxis || 0.5;
		const height = curveHeight || 1/3;

		let lA = 2/3;
		let lB = 2/3;
		
		if ( handlesLength != undefined ) {

			if ( Array.isArray( handlesLength )) {
				
				lA = handlesLength[0];
				lB = handlesLength[1];
			
			} else {

				lA = lB = handlesLength;
			}
		}

		let hasHOut = true;
		let hasHIn = true;

		if ( hasABhandles != undefined ) {

			if ( Array.isArray( hasABhandles ) )
			{
				hasHOut =  Boolean(hasABhandles[0]) ;
				hasHIn = Boolean(hasABhandles[1]);

			} else { 

				hasHOut = hasHIn = Boolean(hasABhandles);
			}
		}

		if ( !hasHOut ) { this.path.lastSegment.handleOut = null }


		if ( input instanceof HyperPoint ) {
			
			 this.A = this.path.lastSegment;
			 this.B = input.getSegment( hasHIn, true );
			 this.plotCurve( axis, height, lA, lB );
			 this.path.add( this.B );

		} else if ( Array.isArray( input ) ) {

			for ( const hpt of input ) {

				this.A = this.path.lastSegment;
				this.B = hpt.getSegment( hasHIn, true );
				this.plotCurve(axis, height, lA, lB );
				this.path.add(this.B);
			}

		} else {

			console.log('! ERROR: input not recognized @ Pen.add(). Should be HyperPoint or Array of HyperPoints')
		}

		// path.lastCurve.segment1.handleOut = A.handleOut

	};


	public addFlowCurveTo( hpt: any, handlesLength: number, hasABhandles: number | boolean ) {

		// check if a segment already exists at the same location

		let lA = 2/3;
		let lB = 2/3;
		
		if ( handlesLength != undefined ) {

			if ( Array.isArray( handlesLength )) {
				
				lA = handlesLength[0];
				lB = handlesLength[1];
			
			} else {

				lA = lB = handlesLength
			}
		}

		let hasHOut: number | boolean = true;
		let hasHIn: number | boolean = true;

		if ( hasABhandles != undefined ) {

			if ( Array.isArray( hasABhandles ) )
			{
				hasHOut = Boolean(hasABhandles[0]);
				hasHIn = Boolean(hasABhandles[1]);

			} else { 

				hasHOut = hasHIn = hasABhandles;
			}
		}
		
		if ( !hasHOut ) { this.path.lastSegment.handleOut = null }
		
		this.A = this.path.lastSegment;
		this.B = hpt.getSegment( [ hasHIn, true ] );

		this.plotFlowCurve( lA, lB );

		this.path.add( this.B );


		//-------------------------------------------
		// Post-processing

		// if ( !hasHIn ) 
		// {
		// 	B.handleIn = null
		// }

		// if ( !hasHOut ) { path.lastCurve.handle1 = A.handleOut }
		
		// if ( B.handleIn ) {
		// 	if ( B.handleIn.length <= 1) B.handleIn = null
		// }

		// if ( B.handleOut ) {
		// 	if ( B.handleOut.length <= 1 ) B.handleOut = null
		// }	

	};


	public mirrorRepeat( MODE: string, findMid: boolean = false, trim: boolean = false ) {

		const hor = MODE === 'HOR' ? -1 : 1;
		const ver = MODE === 'HOR' ? 1 : -1;


		if ( findMid ) {

			this.path.divideAt( this.path.lastCurve.getLocationAtTime(0.5) );
			this.path.lastSegment.remove();
		} 

		const _path = this.path.clone();

		if ( trim ) {

			_path.lastSegment.remove();
		}

		_path.pivot = _path.lastSegment.point;
		_path.position = this.path.lastSegment.point;

		_path.scale( hor, ver );

		this.path.join(_path);
	};
	

	public trim( path: any ) {

		if ( path !== undefined ) {

			path.firstSegment.handleIn = null;
			path.lastSegment.handleOut = null;

		} else {

			this.path.firstSegment.handleIn = null;
			this.path.lastSegment.handleOut = null;
		}

		return path;
	};

}

export default Pen


