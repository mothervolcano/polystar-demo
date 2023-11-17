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
} from "@mantine/core";
import { useState } from "react";
import PaperStage from "./components/PaperStage";
import useModel from "./hooks/useModel";


import { Model, Param, ParamSet } from "./polystar";


// -------------------------------------------------------------------------------------------------------

const UI = () => {
	const [isPaperLoaded, setIsPaperLoaded] = useState<boolean>(false);
	const [initialized, setInitialized] = useState<boolean>(false);
	const [models, currentModel, setCurrentModel] = useModel();
	const [paramsForConsole, setParamsForConsole] = useState<ParamSet | null>(
		null,
	);	

	// -------------------------------------------------------------------------------------------------------
	// AUX	

	const switchConsole = (model: Model) => {
		const Console = model.console;
		return (
			<Console
				params={paramsForConsole}
				inputHandler={handleParamCtrlInputForModel}
			/>
		);
	};

	// -------------------------------------------------------------------------------------------------------
	// HANDLERS
	
	const handleParamCtrlInputForModel = (updatedParams: any) => {
		setParamsForConsole(updatedParams);
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
				border: "1px solid red",
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
								Project description goes here. It should be a
								brief succint text introducing the concept
							</Text>
						</Container>
						<Stack w={"100%"} p={15}>
							{initialized &&
								currentModel &&
								switchConsole(currentModel)}
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
							<div
								style={{
									position: "absolute",
									top: "15px",
									left: "15px",
								}}
							>
								<Stack gap={9}>
									<Text
										size="sm"
										fw={500}
										c={softDark}
										ml="1vw"
									>
										Choose a model...
									</Text>
								</Stack>
							</div>
							<PaperStage onPaperLoad={setIsPaperLoaded} />
						</div>
					</Grid.Col>
				</Grid>
			</div>
		</div>
	);
};

export default UI;
