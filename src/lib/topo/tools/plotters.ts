import { merge } from './stitcher';

export function plotAttractorFirstIntersection( field: any, i1: number, i2: number ) {

	return field.getAttractor( i1 ).locateFirstIntersection( field.getAttractor( i2 ), true );	
};


export function plotAttractorLastIntersection( field: any, i1: number, i2: number ) {

	return field.getAttractor( i1 ).locateLastIntersection( field.getAttractor( i2 ), true );	
};

// ORDER: [ 'FIRST', 'LAST' ]
// MODE: [ 'NEXT', 'PREV' ]

export function plotAllAttractorIntersections( field: any, MODE: string = 'NEXT', ORDER: string = 'FIRST' ) {

	const pts = [];

	const atts = field.getChildren();
	
	const start = MODE === 'NEXT' ? 0 : 1;
	const end = MODE === 'NEXT' ? -1 : 0;

	for ( let i=start; i<atts.length+end; i++ ) {

		let plotter; 

		if ( atts[i].orientation === 1 ) {

			plotter = ORDER === 'FIRST' ? plotAttractorFirstIntersection : plotAttractorLastIntersection;

		} else {

			plotter = ORDER === 'FIRST' ? plotAttractorLastIntersection : plotAttractorFirstIntersection;
		}

		let iIntersected: any;
		let iIntersector: any;


		switch ( MODE ) {

			case 'NEXT':

				iIntersected = i;
				iIntersector = i+1;

				break;

			case 'PREV':

				iIntersected = i;
				iIntersector = i-1;

				break;
		}

		pts.push( plotter( field, iIntersected, iIntersector ) );
	}

	return pts;
};


export function mergeAllAttractorIntersections( field: any ) {

	const pts1 = plotAllAttractorIntersections( field );
	const pts2 = plotAllAttractorIntersections( field, 'PREV', 'LAST' );

	const pts = [];

	for ( const i in pts1 ) {
		pts.push( merge(pts1[i], pts2[i]) );
	}

	return pts
}