import { SyntheticEvent, useContext, useEffect, useState } from "react";

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

// .......................................................

import { Model, Param, ParamSet } from "./polystar";

import useModel from "./hooks/useModel";
import PaperStage from "./components/PaperStage";

import { reset, initModel, configure, draw, extractPath } from "./stage";
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

// -------------------------------------------------------------------------------------------------------

const UI = () => {
	const [isPaperLoaded, setIsPaperLoaded] = useState<boolean>(false);
	const [initialized, setInitialized] = useState<boolean>(false);
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

		reset();
		initModel(currentModel.model);
		configure(options);
		draw(params, scaleCtrl);

		if (!initialized) {
			setInitialized(true);
		}
	}, [isPaperLoaded]);

	// ......................................................

	useEffect(() => {
		if (!isPaperLoaded) {
			console.log("PAPER ISN'T LOADED");
			return () => {};
		}

		const params = parseParams(currentModel.params);

		reset();
		draw(params, scaleCtrl);
	}, [paramsForConsole]);

	// ......................................................

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

	// -------------------------------------------------------------------------------------------------------
	// HANDLERS

	const handleParamCtrlInputForModel = (updatedParams: any) => {
		setParamsForConsole(updatedParams);
	};

	const saveShape = (event: SyntheticEvent) => {
		event.preventDefault();

		const currentShapePath = extractPath();
		const currentShapeSvgData = convertPathToSVG(currentShapePath, 1);

		const shapeToSave = {
			timestamp: null,
			svg: currentShapeSvgData,
			width: currentShapePath.bounds.width,
			height: currentShapePath.bounds.height
		};

		currentShapePath.remove();

		const collection = shapeCollection.slice();
		const nextSlot = collection.findIndex((item) => item.svg === null);
		collection[nextSlot] = shapeToSave;

		setShapeCollection(collection);
	};

	// -------------------------------------------------------------------------------------------------------
	// BLOCKS

	const switchConsole = (model: Model) => {
		const Console = model.console;
		return <Console params={paramsForConsole} inputHandler={handleParamCtrlInputForModel} />;
	};

	// -------------------------------------------------------------------------------------------------------

	const frameMargin = 6;
	const dark = DEFAULT_THEME.colors.dark[5];
	const softDark = DEFAULT_THEME.colors.dark[0];
	const light = DEFAULT_THEME.colors.gray[0];
	const softLight = DEFAULT_THEME.colors.gray[2];

	return (
		<div
			style={{
				position: "relative",
				width: "100%",
				height: "100vh",
				padding: `${frameMargin}vh`,
			}}
		>
			<div style={{ border: `1px solid ${dark}`, borderRadius: `10px` }}>
				<Grid align="stretch" gutter={0}>
					<Grid.Col span={2}>
						<Container
							fluid
							w="100%"
							bg={dark}
							pt="sm"
							pb="md"
							mb="md"
							style={{ borderRadius: "8px 0 0 0" }}
						>
							<Title c={light}>Polystar</Title>
							<Space h="md" />
							<Text size="sm" c={softLight}>
								Project description goes here. It should be a brief succint text introducing the concept
							</Text>
						</Container>
						<Stack w={"100%"} p={0} gap={15}>
							{initialized && currentModel && switchConsole(currentModel)}
								<Divider  />
							<div style={{paddingLeft: "1rem", paddingRight: "1rem"}}>
								<Text size="xs" fw="500" c="var(--mantine-color-dark-3)">
									Change Fill Color
								</Text>
								<Space h="sm" />
								<ColorPicker w="100%" format="hex" value={artColor} onChange={setArtColor} />
							</div>
								<Divider my="md"/>
							<Space h="md" />
						</Stack>
					</Grid.Col>
					<Grid.Col span={10}>
						<div
							style={{
								position: "relative",
								height: `${100 - frameMargin * 2}vh`,
								borderLeft: `1px solid ${dark}`,
							}}
						>
							<PaperStage onPaperLoad={setIsPaperLoaded} />
							<div
								style={{
									position: "absolute",
									top: "15px",
									left: "15px",
								}}
							></div>
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
								<Gallery />
							</div>
						</div>
					</Grid.Col>
				</Grid>
			</div>
		</div>
	);
};

export default UI;
