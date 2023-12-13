import { useRef, useEffect, useLayoutEffect, useState, RefObject } from "react";

import { PaperScope } from "paper";
import useResizeObserver from "@react-hook/resize-observer";

export const paperScope = new PaperScope();

const useSize = (target: RefObject<HTMLElement>): DOMRect | undefined => {
	const [size, setSize] = useState<DOMRect>();

	useLayoutEffect(() => {
		if (!target || !target.current) {
			throw new Error(`ERROR @useSize hook: element not found`);
		}
		setSize(target.current.getBoundingClientRect());
	}, [target]);

	useResizeObserver(target, (entry: any) => setSize(entry.contentRect));

	return size;
};

const PaperStage = ({ onPaperLoad, onResize }: any) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const size = useSize(containerRef);

	useEffect(() => {
		if (canvasRef.current !== null) {
			paperScope.install(window);
			paperScope.setup(canvasRef.current);
			onPaperLoad(true);
		} else {
			//TODO: error message
		}
	}, []);

	useEffect(() => {
		// Update canvas size based on parent size
		if (canvasRef.current && size) {
			canvasRef.current.width = size.width;
			canvasRef.current.height = size.height;
			onResize({ width: size.width, height: size.height });
		}
	}, [size]);

	const canvasWidth = size ? `${size.width}px` : "100%";
	const canvasHeight = size ? `${size.height}px` : "100%";

	return (
		<div ref={containerRef} style={{ width: "100%", height: "100%" }}>
			<canvas style={{ position: "relative", width: canvasWidth, height: canvasHeight }} ref={canvasRef}></canvas>
		</div>
	);
};

export default PaperStage;
