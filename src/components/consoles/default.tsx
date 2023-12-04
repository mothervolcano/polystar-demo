import { Text, Slider, Stack, DEFAULT_THEME, rem } from "@mantine/core";
import sliderStyles from "../../styles/slider.module.css";

const dark = DEFAULT_THEME.colors.dark[5];
const softDark = DEFAULT_THEME.colors.dark[0];
const light = DEFAULT_THEME.colors.gray[0];
const softLight = DEFAULT_THEME.colors.gray[2];

interface ConsoleProps {
	params: any;
	inputHandler: Function;
	layout: string;
	size: string;
}

interface Style {
	width: string;
	display: string;
	flexDirection: React.CSSProperties["flexDirection"];
	justifyContent?: React.CSSProperties["justifyContent"];
	gap?: string;
}

const labelStyleProps = {
	size: "xs",
	fw: "500",
	c: "var(--mantine-color-dark-3)",
	pb: "0.30rem",
};

const StyledText = (props: any) => {
	return <Text {...labelStyleProps}>{props.children}</Text>;
};

const DefaultConsole = (props: ConsoleProps) => {
	const { params, inputHandler, layout, size } = props;

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

	const rowLayout: Style = {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		gap: "1rem",
	};

	const colLayout: Style = {
		width: "100%",
		display: "flex",
		flexDirection: "column",
	};

	const gap = size === "COMPACT" ? "0.75rem" : "1rem";

	return (
		<div style={layout === "ROW" ? rowLayout : colLayout}>
			<div style={{ width: "100%" }}>
				{params
					.filter((p: any) => p.rank === 1)
					.map((p: any) => (
						<div
							key={p.id}
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
							}}
						>
							<div style={{ width: "100%", paddingBottom: gap }}>
								<StyledText>{p.label}</StyledText>
								<Slider
									id={p.id}
									name={p.id}
									min={p.range[0]}
									max={p.range[1]}
									step={p.step}
									onChange={(value) => {
										handleSliderInput(value, p.id);
									}}
									value={p.value}
									size="1px"
									thumbSize={rem(10)}
									color={dark}
									showLabelOnHover={false}
									styles={{ thumb: { backgroundColor: dark, borderWidth: 0 } }}
									classNames={sliderStyles}
								/>
							</div>
						</div>
					))}
			</div>
			<div style={{ width: "100%" }}>
				{params
					.filter((p: any) => p.rank === 2)
					.map((p: any) => (
						<div
							key={p.id}
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
							}}
						>
							<div style={{ width: "100%", paddingBottom: gap }}>
								<StyledText>{p.label}</StyledText>
								<Slider
									id={p.id}
									name={p.id}
									min={p.range[0]}
									max={p.range[1]}
									step={p.step}
									onChange={(value) => {
										handleSliderInput(value, p.id);
									}}
									value={p.value}
									size="1px"
									thumbSize={rem(10)}
									color={dark}
									showLabelOnHover={false}
									styles={{ thumb: { backgroundColor: dark, borderWidth: 0 } }}
									classNames={sliderStyles}
								/>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default DefaultConsole;
