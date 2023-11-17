import { Point, Segment } from 'paper';

import { BooleanLike, IHyperPoint, IPoint, PointLike, SizeLike } from '../types';

import HyperPoint from '../core/hyperPoint'


export function convertToPoint( pt: any ) {

  return new Point( pt.x, pt.y );
}


export function convertToSegment( pt: any, withInHandle: BooleanLike = true, withOutHandle: BooleanLike = true ) {

  const includeInHandle = Boolean( withInHandle );
  const includeOutHandle = Boolean( withOutHandle );    
    
  let hIn = null;
  let hOut = null;

   if (includeInHandle ) {
     hIn = pt.handleIn;
   }

  if (includeOutHandle ) {
    hOut = pt.handleOut;
  }

  return new Segment ( pt.point, hIn, hOut );

}


export function convertToHyperPoint( pt: PointLike ): IHyperPoint {

  const P = new HyperPoint( pt );
  P.spin = 1;

  return P as IHyperPoint;
}



export function validatePointInput(input: any): IPoint {
	  
  if ( input === null ) { return new Point(0,0) };

  if (Array.isArray(input) && input.length === 2) {
    
    let x = input[0];
    let y = input[1];

    if (typeof x !== 'number') { x = parseFloat(x); }
    if (typeof y !== 'number') { y = parseFloat(y); }

    if (Number.isNaN(x) && Number.isNaN(y)) {
      throw new Error('Invalid point input: Invalid numeric values');
    }

    if (Number.isNaN(x)) { x = 0; }
    if (Number.isNaN(y)) { y = 0; }

    return new Point(x, y);

  }

  if (typeof input === 'object' && input !== null) {
    
    let x = Number.NaN;
    let y = Number.NaN;

    if ('x' in input) {
      if (typeof input.x === 'number') {
        x = input.x;
      } else if (typeof input.x === 'function') {
        x = input.x();
      }
    }

    if ('y' in input) {
      if (typeof input.y === 'number') {
        y = input.y;
      } else if (typeof input.y === 'function') {
        y = input.y();
      }
    }

    if (Number.isNaN(x) && Number.isNaN(y)) {
      throw new Error('Invalid point input: Invalid numeric values');
    }

    if (Number.isNaN(x)) { x = 0; }
    if (Number.isNaN(y)) { y = 0; }

    return new Point(x, y);
    
  }

  if (typeof input === 'object' && input !== null && 'width' in input && 'height' in input) {
    
    let width = input.width;
    let height = input.height;

    if (typeof width !== 'number') { width = parseFloat(width); }
    if (typeof height !== 'number') { height = parseFloat(height); }

    if (Number.isNaN(width) && Number.isNaN(height)) {
      throw new Error('Invalid point input: Invalid numeric values');
    }

    if (Number.isNaN(width)) { width = 0; }
    if (Number.isNaN(height)) { height = 0; }

    const x = width / 2;
    const y = height / 2;

    return new Point( x, y );
  }

  throw new Error('Invalid point input');
}



export function validateSizeInput( input: any ): [number, number] {
    
  let validWidth = 0;
  let validHeight = 0;

  if ( typeof input === 'number' ) {

    validWidth = input;
    validHeight = input;
  }

  if ( Array.isArray(input) && input.length === 2 ) {

    validWidth = parseFloat(input[0]);
    validHeight = parseFloat(input[1]);

  } else if ( typeof input === 'object' && input !== null ) {

    validWidth = parseFloat(input.width);
    validHeight = parseFloat(input.height);
  }

  if ( !Number.isFinite(validWidth) && !Number.isFinite(validHeight) ) {

    throw new Error('Invalid size input');
  }

  // Handle case when only one value is missing or invalid
  if ( !Number.isFinite(validWidth) ) {

    validWidth = validHeight;
  }

  if ( !Number.isFinite(validHeight) ) {

    validHeight = validWidth;
  }

  return [ validWidth, validHeight ];
}


