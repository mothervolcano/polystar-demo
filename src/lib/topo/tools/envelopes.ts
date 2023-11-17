
export function arch( field: any, handler: Function, switchHandler: Function ) {

	const num = field.getChildren().length;
	
	for ( let i = 0; i < num/2; i++ ) {

		handler( field.getAttractor(i), i );

	}

	switchHandler();
	
	for ( let i = num-1; i > num/2 ; i-- ) {

		handler( field.getAttractor(i), i );
	}
}