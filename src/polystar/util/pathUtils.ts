export function convertPathToSVG( path: any, scale: number = 1 ) {

  let output = "";

  for ( const c of path.curves )
  {
    
    if ( c.isFirst() )
    {
      output += "M " + c.point1.x * scale + " " + c.point1.y * scale;
    }

    if ( c.isStraight() )
    {
      output += " L " + c.point2.x * scale + " " + c.point2.y * scale;

    } else {

      output += " C " + ( c.point1.x + c.handle1.x ) + " " + ( c.point1.y + c.handle1.y ) + " " + ( c.point2.x + c.handle2.x ) + " " + ( c.point2.y + c.handle2.y ) + " " + c.point2.x + " " + c.point2.y;
 
    }

    if ( c.isLast() )
    {
      //output += " Z";
    }

  }

  return output;

}