import { AspectRatio, Container } from "@mantine/core";

interface SaveSlotProps {
	name: string;
	placeholder: any;
}

const SaveSlot = (props: SaveSlotProps) => {
	const { name, placeholder } = props;

	console.log("SVG data: ", placeholder);

	// return (
	// 	<div>
	// 		<AspectRatio ratio={1 / 1}>
	// 			<Container>
	// 				{placeholder && (
	// 					<div style={{ backgroundColor: "gray" }}>
	// 						<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
	// 							<path d="M488.2701822916668 510.3984375 C 488.2701822916668 509.13251953125 495.85117285591275 505.37004441278725 495.85117285591275 505.37004441278725 C 495.85117285591275 505.37004441278725 501.0700195312502 496.33268229166663 502.3359375000001 496.33268229166663 C 503.60185546875016 496.33268229166663 507.36433058721286 503.91367285591264 507.36433058721286 503.91367285591264 C 507.36433058721286 503.91367285591264 516.4016927083335 509.13251953125 516.4016927083335 510.3984375 C 516.4016927083335 511.66435546875 508.8207021440875 515.4268305872127 508.8207021440875 515.4268305872127 C 508.8207021440875 515.4268305872127 503.60185546875016 524.4641927083334 502.3359375000001 524.4641927083334 C 501.0700195312501 524.4641927083334 497.3075444127874 516.8832021440874 497.3075444127874 516.8832021440874 C 497.3075444127874 516.8832021440874 488.2701822916668 511.66435546875 488.2701822916668 510.3984375" stroke="blue" stroke-width="4" fill="none" />
	// 						</svg>
	// 					</div>
	// 				)}
	// 			</Container>
	// 		</AspectRatio>
	// 	</div>
	// );

	return (
		<div>
			<AspectRatio ratio={1 / 1}>
				<Container>
					{placeholder && (
						<svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
							<path d={placeholder} fill="black" />
						</svg>
					)}
				</Container>
			</AspectRatio>
		</div>
	);
};

export default SaveSlot;
