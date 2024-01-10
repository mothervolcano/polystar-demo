import { PaperScope, Size } from "paper";
import { useRef, useEffect, useState, RefObject } from "react";

const paperScope = new PaperScope();

/**
 * Create install and set up paper with a canvas element
 * */
function usePaperScope(): [RefObject<HTMLCanvasElement>, paper.PaperScope] {

	const canvasRef = useRef<HTMLCanvasElement>(null);

	/**
	 * Set up the Paper Project with a canvas element
	 * */
	useEffect(() => {

		paperScope.install(window);

		if (canvasRef.current) {
			if (paperScope.projects.length === 0 ) {
				paperScope.setup(canvasRef.current);
			}
		}
	}, [canvasRef.current]);

	return [canvasRef, paperScope];
}

export default usePaperScope;
