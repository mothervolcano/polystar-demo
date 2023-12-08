import { SyntheticEvent, useContext, useEffect, useRef, useState } from "react";

import { Container, Flex, Stack, Title, Text, DEFAULT_THEME, Space, ColorPicker, Button, Divider } from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";

// .......................................................

import { Model, ParamSet } from "./polystar";

import useModel from "./hooks/useModel";
import PaperStage from "./components/PaperStage";

import { reset, resize, initModel, configure, draw, extractPath } from "./stage";
import Gallery from "./components/Gallery";
import { convertPathToSVG } from "./polystar/util/pathUtils";
import ShapeContext from "./ShapeContext";

// --------------------------------------------------------------
// HELPERS

function parseParams(updatedParams: ParamSet) {
	const modelParams: any = {};

	Array.from(updatedParams.values()).forEach((p: any) => {
		modelParams[p.name] = p.value;
	});

	return modelParams;
}

// --------------------------------------------------------------
// LAYOUT COMPONENTS

const Layout = ({ orientation, children }: any) => {
	// ...
	if (orientation === "LANDSCAPE") {
		return (
			<Flex direction="row">
				<div style={{ position: "relative", minWidth: "300px", maxWidth: "25%", overflowY: "auto" }}>{children[0]}</div>
				<div style={{ position: "relative", minWidth: "250px", flexGrow: "1" }}>{children[1]}</div>
			</Flex>
		);
	} else if (orientation === "PORTRAIT") {
		// return (<div style={{display: "flex", flexDirection: "column", height: "100vh"}}>
		// 			{/*<div style={{minHeight: "200px", maxHeight: "30%"}}>{children[1]}</div>*/}
		// 			<div style={{height: "20vh"}}>{children[1]}</div>
		// 			<div style={{minWidth: "250px", flexGrow: "1"}}>{children[0]}</div>
		// 		</div>)
		return (
			<Stack justify="flex-start" align="stretch">
				<div style={{ position: "relative" }}>{children[1]}</div>
				<div style={{ position: "relative", overflowY: "auto" }}>{children[0]}</div>
			</Stack>
		);
	} else {
		return null;
	}
};

// -------------------------------------------------------------------------------------------------------

const UI = () => {

	const [isPaperLoaded, setIsPaperLoaded] = useState<boolean>(false);
	const [initialized, setInitialized] = useState<boolean>(false);
	const [stageSize, setStageSize] = useState<{ width: number; height: number } | null>(null);
	const [models, currentModel, setCurrentModel] = useModel();
	const [paramsForConsole, setParamsForConsole] = useState<ParamSet | null>(null);
	const [hasFill, setHasFill] = useState<boolean>(true);
	const [artColor, setArtColor] = useState("#000000");
	const [scaleCtrl, setScaleCtrl] = useState(3);

	const { shapeCollection, setShapeCollection } = useContext(ShapeContext);

	// const [shapeCollection, setShapeCollection] = useState<savedShape[]>(new Array(6).fill({timestamp: null, svg: null}))

	// -------------------------------------------------------------------------------------------------------
	// HOOKS

	useEffect(() => {
		if (!isPaperLoaded) {
			console.log("PAPER ISN'T LOADED");
			return () => {};
		}

		console.log("1 --> PAPERJS LOADED! CurrentModel: ", artColor);

		setParamsForConsole(currentModel.params);
		const params = parseParams(currentModel.params);

		const options = {
			fill: hasFill,
			color: artColor,
		};

		// if (stageSize) { resize(stageSize); }
		reset();
		initModel(currentModel.model);
		configure(options);
		draw(params, scaleCtrl);

		if (!initialized) {
			setInitialized(true);
		}
	}, [isPaperLoaded, stageSize]);

	// ......................................................
	// Shape modifier controls changed

	useEffect(() => {
		if (!isPaperLoaded) {
			console.log("PAPER ISN'T LOADED");
			return () => {};
		}

		// console.log("1 --> Console Input! CurrentModel: ", artColor);

		const params = parseParams(currentModel.params);

		// if (stageSize) { resize(stageSize); }
		reset();
		draw(params, scaleCtrl);
	}, [paramsForConsole]);

	// ......................................................
	// Color settings changed

	useEffect(() => {
		if (!isPaperLoaded) {
			console.log("PAPER ISN'T LOADED");
			return () => {};
		}

		const params = parseParams(currentModel.params);

		const options = {
			fill: hasFill,
			color: artColor,
		};

		console.log("color: ", artColor);

		reset();
		configure(options);
		draw(params, scaleCtrl);
	}, [hasFill, artColor]);

	// .....................................................

	useEffect(() => {
		if (!isPaperLoaded) {
			console.log("PAPER ISN'T LOADED");
			return () => {};
		}

		if (stageSize) {
			resize(stageSize);
		}
	}, [stageSize]);

	// -------------------------------------------------------------------------------------------------------
	// HANDLERS

	const handleParamCtrlInputForModel = (updatedParams: any) => {
		setParamsForConsole(updatedParams);
	};

	const saveShape = (event: SyntheticEvent) => {
		// ...
		event.preventDefault();

		const currentShapePath = extractPath();
		const currentShapeSvgData = convertPathToSVG(currentShapePath, 1);

		const shapeToSave = {
			timestamp: null,
			svg: currentShapeSvgData,
			color: artColor,
			width: currentShapePath.bounds.width,
			height: currentShapePath.bounds.height,
		};

		currentShapePath.remove();

		const collection = shapeCollection.slice();
		const nextSlot = collection.findIndex((item) => item.svg === null);
		collection[nextSlot] = shapeToSave;

		setShapeCollection(collection);
	};

	// -------------------------------------------------------------------------------------------------------
	// MEDIA QUERIES

	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const isLandscape = useMediaQuery("(orientation: landscape)");
	const isPortrait = useMediaQuery("(orientation: portrait)");

	// -------------------------------------------------------------------------------------------------------
	// STYLES

	const frameMargin = 6;
	const dark = DEFAULT_THEME.colors.dark[5];
	const softDark = DEFAULT_THEME.colors.dark[0];
	const light = DEFAULT_THEME.colors.gray[0];
	const softLight = DEFAULT_THEME.colors.gray[2];

	const containerStyle = {
		// position: "relative",
		width: "100%",
		height: "100vh",
		padding: isDesktop ? `${frameMargin}vh` : "0",
	};

	const frameStyle = {
		border: isDesktop ? `1px solid ${dark}` : "none",
		borderRadius: isDesktop ? `10px` : "none",
	};

	const sidebarStyle = {
		borderRadius: isDesktop ? "8px 0 0 0" : "none",
	};

	const stageStyle = {
		height: isLandscape ? `${100 - frameMargin * 2}vh` : `45vh`,
		borderLeft: isLandscape ? `1px solid ${dark}` : "none",
		borderBottom: isLandscape ? "none" : `1px solid ${dark}`,
	};

	const titleStyle = {
		position: "absolute",
		top: "15px",
		left: "15px",
	};

	const consoleLayoutType = isPortrait ? "ROW" : "COL";
	const consoleLayoutMode = isPortrait ? "COMPACT" : "NORMAL";

	// -------------------------------------------------------------------------------------------------------
	// BLOCKS

	const consoleSwitch = (model: Model, layout: string, mode: string) => {
		const Console = model.console;
		return (
			<Console
				params={paramsForConsole}
				inputHandler={handleParamCtrlInputForModel}
				layout={layout}
				mode={mode}
			/>
		);
	};

	const title = () => {
		return (
			<div
				style={{
					position: "absolute",
					top: "0.50rem",
					left: "1rem",
				}}
			>
				<Title c={dark}>Polystar</Title>
			</div>
		);
	};

	const header = () => {
		return (
			<Container fluid w="100%" bg={dark} pt="sm" pb="md" mb="md" style={sidebarStyle}>
				<Title c={light}>Polystar</Title>
				<Space h="md" />
				<Text size="sm" c={softLight}>
					A polygon based shape creator.
				</Text>
			</Container>
		);
	};

	const panel = () => {
		return (
			<div style={{ width: "100%" }}>
				{isLandscape && header()}
				<Stack w={"100%"} pt="0.5rem" pl="1rem" pr="1rem" gap={15}>
					{initialized && currentModel && consoleSwitch(currentModel, consoleLayoutType, consoleLayoutMode)}
					<div style={{}}>
						<Text
							size={isPortrait ? "0.80rem" : "sm"}
							fw={isPortrait ? "400" : "500"}
							c={isPortrait ? "var(--mantine-color-dark-2)" : "var(--mantine-color-dark-3)"}
						>
							Change Fill Color
						</Text>
						<Space h="sm" />
						<ColorPicker size="xs" w="100%" format="hex" value={artColor} onChange={setArtColor} />
					</div>
				</Stack>
			</div>
		);
	};

	const stage = () => {
		return (
			<div style={stageStyle}>
				<PaperStage onPaperLoad={setIsPaperLoaded} onResize={setStageSize} />
				{!isLandscape && title()}
				<div
					style={{
						position: "absolute",
						bottom: "0px",
						left: "0px",
						width: "100%",
					}}
				>
					{isLandscape && (
						<>
							<Flex justify="flex-end">
								<Button style={{}} bg={dark}  m="1rem" variant="filled" onClick={saveShape}>
									Save
								</Button>
							</Flex>
							<Gallery />
						</>
					)}
				</div>
			</div>
		);
	};

	// -------------------------------------------------------------------------------------------------------

	return (
		<div style={containerStyle}>
			<div style={frameStyle}>
				<Layout orientation={isLandscape ? "LANDSCAPE" : "PORTRAIT"}>
					{panel()}
					{stage()}
				</Layout>
			</div>
		</div>
	);
};

export default UI;