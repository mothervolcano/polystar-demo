import { SyntheticEvent, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

import {
	Container,
	Flex,
	Grid,
	NumberInput,
	SegmentedControl,
	SegmentedControlItem,
	Stack,
	Title,
	Text,
	DEFAULT_THEME,
	Space,
	Slider,
	AspectRatio,
	Group,
	ColorPicker,
	Button,
	Divider,
} from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";
import useResizeObserver from "@react-hook/resize-observer";

// .......................................................

import { Model, Param, ParamSet } from "./polystar";

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
				<div style={{ position: "relative", minWidth: "300px", maxWidth: "25%" }}>{children[0]}</div>
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
				<div style={{ position: "relative" }}>{children[0]}</div>
			</Stack>
		);
	} else {
		return null;
	}
};

// -------------------------------------------------------------------------------------------------------

const UI = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	const [isPaperLoaded, setIsPaperLoaded] = useState<boolean>(false);
	const [initialized, setInitialized] = useState<boolean>(false);
	const [stageSize, setStageSize] = useState<{ width: number; height: number } | null>(null);
	const [models, currentModel, setCurrentModel] = useModel();
	const [paramsForConsole, setParamsForConsole] = useState<ParamSet | null>(null);
	const [hasFill, setHasFill] = useState<boolean>(true);
	const [artColor, setArtColor] = useState("10FF0C");
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

		console.log("1 --> PAPERJS LOADED! CurrentModel: ", currentModel);

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
		height: isLandscape ? `${100 - frameMargin * 2}vh` : `40vh`,
		borderLeft: `1px solid ${dark}`,
	};

	const titleStyle = {
		position: "absolute",
		top: "15px",
		left: "15px",
	};

	// -------------------------------------------------------------------------------------------------------
	// BLOCKS

	const consoleSwitch = (model: Model) => {
		const Console = model.console;
		return <Console params={paramsForConsole} inputHandler={handleParamCtrlInputForModel} />;
	};

	const title = () => {
		return (
			<div
				style={{
					position: "absolute",
					top: "15px",
					left: "15px",
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
					Project description goes here. It should be a brief succint text introducing the concept
				</Text>
			</Container>
		);
	};

	const panel = () => {
		return (
			<div style={{ width: "100%" }}>
				{isLandscape ? header() : <Divider />}
				<Stack w={"100%"} p={0} gap={15}>
					{initialized && currentModel && consoleSwitch(currentModel)}
					<Divider />
					<div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
						<Text size="xs" fw="500" c="var(--mantine-color-dark-3)">
							Change Fill Color
						</Text>
						<Space h="sm" />
						<ColorPicker w="100%" format="hex" value={artColor} onChange={setArtColor} />
					</div>
					<Divider my="md" />
					<Space h="md" />
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
					<Flex justify="flex-end">
						<Button style={{}} m="1rem" variant="filled" onClick={saveShape}>
							Save
						</Button>
					</Flex>
					{isLandscape && <Gallery />}
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
