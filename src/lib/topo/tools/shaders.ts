import { Color } from 'paper';


export function applyShade( shader: any, solidColor: any, fadeColor: any, gradvector: any, blendMode: any, shift1: any, shift2: any ) {
    
    const originPoint = gradvector.firstSegment.point;
    const destinationPoint = gradvector.lastSegment.point;
    //var gradient = new paper.Gradient( [ shaderChart.get(style).color, shaderChart.get( style ).alpha ] );

    const _solidColor = new Color( solidColor ).convert('rgb');
    const _fadeColor = new Color( fadeColor ).convert('rgb');
    _fadeColor.alpha = 0;

    shader.style = {
        
        fillColor: { 
            
            gradient: {
                
                stops: [ [ _solidColor, shift1 ], [ _fadeColor, shift2 ] ]
            },

            origin: originPoint,
            destination: destinationPoint
        }
    }

    shader.blendMode = blendMode;
}


export function applyBlush( shader: any, solidColor: any, fadeColor: any, blendMode: any, shift1: number, shift2: number ) {

    const _solidColor = new Color( solidColor ).convert('rgb');
    const _fadeColor = new Color( fadeColor ).convert('rgb');
    _fadeColor.alpha = 0;

    shader.style = {

        fillColor: {

            gradient: {

                stops: [ [ _solidColor, shift1 ], [ _fadeColor, shift2 ] ],
                radial: true
            },

            origin: shader.position,
            destination: shader.bounds.rightCenter
        }
    }
}