import { PaperScope, Size } from "paper";
import { useRef, useEffect, useState, RefObject } from "react";

const initPaperScope = new PaperScope();

/**
 * Create a new paperScope only when the canvas element is (re)rendered
 * */
function usePaperScope(
	stageSize: any,
): [RefObject<HTMLCanvasElement>, paper.PaperScope, paper.Size | null] {
	const [paperScope, setPaperScope] = useState<paper.PaperScope>(initPaperScope);
	const [viewSize, setViewSize] = useState<paper.Size | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	/**
	 * Create a new paperScope only when the canvas element is (re)rendered
	 * */
	useEffect(() => {
		console.log("canvas changed! ", paperScope.view?.element.id, canvasRef.current?.id);
		if (canvasRef.current !== null && paperScope.view?.element.id !== canvasRef.current.id) {
			setPaperScope(new PaperScope());
			paperScope.install(window);
			paperScope.activate();
			console.log("... creating a paperScope ", canvasRef.current.id, paperScope.view?.element.id);
		}
	}, [canvasRef.current]);

	/**
	 * Ensure that there is always only a single project in the paperScope
	 * */
	useEffect(() => {
		if (canvasRef.current !== null && paperScope.projects.length === 0) {
			paperScope.setup(canvasRef.current);
			setViewSize(paperScope.view.size);
			console.log("... setting up paperScope ", paperScope.view.element.id);
		}
	}, [paperScope]);

	/**
	 * Update the paper PaperScope/Project/View and the viewSize state
	 * that a parent component might be listening to.
	 * */
	useEffect(() => {
		console.log("size changed! ");

		if (canvasRef.current !== null && paperScope) {
			setViewSize(paperScope.view.size);
		}
	}, [stageSize]);

	return [canvasRef, paperScope, viewSize];
}

export default usePaperScope;
