import { Text, Slider, Stack } from "@mantine/core";
import sliderStyles from "../../styles/slider.module.css";

interface ConsoleProps {
	params: any;
	inputHandler: Function;
}

const labelStyleProps = {
	size: "xs",
	fw: "500",
	c: "var(--mantine-color-dark-3)",
};

const StyledText = (props: any) => {
	return <Text {...labelStyleProps}>{props.children}</Text>;
};

const DefaultConsole = (props: ConsoleProps) => {
	const { params, inputHandler } = props;

	// ------------------------------------------------------

	function handleSliderInput(value: number, id: string) {
		console.log(`@DefaultConsole: slider ---> ${value}  / ${id}`);

		const updatedParams = params.slice();

		updatedParams.map((item: any) => {
			if (item.id === id) {
				item.value = value;
			}
		});

		inputHandler(updatedParams);
	}

	return (
		<Stack p="1rem" gap={25}>
			<Stack gap={3}>
				<StyledText>{params[0].label}</StyledText>
				<Slider
					id={params[0].id}
					name={params[0].id}
					min={params[0].range[0]}
					max={params[0].range[1]}
					step={params[0].step}
					onChange={(value) => {
						handleSliderInput(value, params[0].id);
					}}
					value={params[0].value}
					classNames={sliderStyles}
				/>
			</Stack>

			<Stack gap={2}>
				<StyledText>{params[1].label}</StyledText>
				<Slider
					id={params[1].id}
					name={params[1].id}
					min={params[1].range[0]}
					max={params[1].range[1]}
					step={params[1].step}
					onChange={(value) => {
						handleSliderInput(value, params[1].id);
					}}
					value={params[1].value}
					classNames={sliderStyles}
				/>
			</Stack>

			<Stack gap={2}>
				<StyledText>{params[2].label}</StyledText>
				<Slider
					id={params[2].id}
					name={params[2].id}
					min={params[2].range[0]}
					max={params[2].range[1]}
					step={params[2].step}
					onChange={(value) => {
						handleSliderInput(value, params[2].id);
					}}
					value={params[2].value}
					classNames={sliderStyles}
				/>
			</Stack>

			<Stack gap={2}>
				<StyledText>{params[3].label}</StyledText>
				<Slider
					id={params[3].id}
					name={params[3].id}
					min={params[3].range[0]}
					max={params[3].range[1]}
					step={params[3].step}
					onChange={(value) => {
						handleSliderInput(value, params[3].id);
					}}
					value={params[3].value}
					classNames={sliderStyles}
				/>
			</Stack>

			<Stack gap={2}>
				<StyledText>{params[4].label}</StyledText>
				<Slider
					id={params[4].id}
					name={params[4].id}
					min={params[4].range[0]}
					max={params[4].range[1]}
					step={params[4].step}
					onChange={(value) => {
						handleSliderInput(value, params[4].id);
					}}
					value={params[4].value}
					classNames={sliderStyles}
				/>
			</Stack>

			<Stack gap={2}>
				<StyledText>{params[5].label}</StyledText>
				<Slider
					id={params[5].id}
					name={params[5].id}
					min={params[5].range[0]}
					max={params[5].range[1]}
					step={params[5].step}
					onChange={(value) => {
						handleSliderInput(value, params[5].id);
					}}
					value={params[5].value}
					classNames={sliderStyles}
				/>
			</Stack>

			<Stack gap={2}>
				<StyledText>{params[6].label}</StyledText>
				<Slider
					id={params[6].id}
					name={params[6].id}
					min={params[6].range[0]}
					max={params[6].range[1]}
					step={params[6].step}
					onChange={(value) => {
						handleSliderInput(value, params[6].id);
					}}
					value={params[6].value}
					classNames={sliderStyles}
				/>
			</Stack>
		</Stack>
	);
};

export default DefaultConsole;
