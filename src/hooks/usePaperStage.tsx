import { PaperScope } from "paper";
import { useRef, useEffect, useState, RefObject } from "react";

export const paperScope = new PaperScope();

function usePaperStage(): [RefObject<HTMLCanvasElement>, boolean] {
	const [isPaperReady, setIsPaperReady] = useState<boolean>(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current !== null) {
			paperScope.install(window);
			paperScope.setup(canvasRef.current);
			setIsPaperReady(true);
		} else {
			//TODO: error message
		}
	}, [canvasRef.current]);

	return [canvasRef, isPaperReady];

}


export default usePaperStage;