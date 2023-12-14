import { useRef, useEffect, ReactNode } from "react";

import useSize from "../hooks/useSize";
import usePaperScope from "../hooks/usePaperScope";

interface StageProps {
	style: object;
	onResize: Function;
	onReady: Function;
	children: ReactNode;
}

const PaperStage = ({ style, onResize, onReady, children }: StageProps) => {
	const stageRef = useRef(null);
	const stageSize = useSize(stageRef);
	const [canvasRef, paperScope, paperViewSize] = usePaperScope(stageSize);

	// console.log("Rendering Stage: ", canvasSize);

	/**
	 *
	 * */
	useEffect(() => {
		// console.log("onReady: ", paperScope?.view);
		onReady(paperScope);
	}, [paperScope]);

	/**
	 *
	 * */
	useEffect(() => {
		// console.log("onResize: ", paperScope?.view);
		if (paperScope?.view) {
			onResize(paperViewSize);
		}
	}, [paperViewSize]);

	const canvasWidth = stageSize ? `${stageSize.width}px` : "100%";
	const canvasHeight = stageSize ? `${stageSize.height}px` : "100%";

	// const canvasWidth = "100%";
	// const canvasHeight = "100%";

	return (
		<div style={style}>
			<div ref={stageRef} style={{ width: "100%", height: "100%" }}>
				<canvas
					ref={canvasRef}
					style={{ position: "relative", width: canvasWidth, height: canvasHeight }}
				></canvas>
			</div>
			{children}
		</div>
	);
};

export default PaperStage;