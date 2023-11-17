export function convertPathToSVG( path: any ) {

  let output = "";

  for ( const c of path.curves )
  {
    
    if ( c.isFirst() )
    {
      output += "M " + c.point1.x + " " + c.point1.y;
    }

    if ( c.isStraight() )
    {
      output += " L " + c.point2.x + " " + c.point2.y;

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