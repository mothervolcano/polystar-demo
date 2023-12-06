import { AspectRatio, Button, Container } from "@mantine/core";
import { useContext } from "react";
import ShapeContext from "../ShapeContext";

interface SaveSlotProps {
	num: number;
	placeholder: any;
	shapeData: any;
}

const SaveSlot = (props: SaveSlotProps) => {
	const { num, placeholder, shapeData } = props;

	const { shapeCollection, setShapeCollection } = useContext(ShapeContext);

	const onDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
		console.log("DELETE SHAPE: ", event.currentTarget.value);

		const updatedCollection = shapeCollection.slice();
		updatedCollection[Number(event.currentTarget.value)] = { timestamp: null, svg: null, width: null, height: null };

		setShapeCollection(updatedCollection);
	};

	return (
		<div>
			<AspectRatio ratio={1 / 1}>
				<Container>
					{shapeData && shapeData.svg && (
						<div>
							<Button
								variant="default"
								size="xs"
								value={num}
								style={{ position: "absolute", bottom: "1rem", right: "1rem" }}
								onClick={(event) => onDelete(event)}
							>
								Remove
							</Button>
							<svg style={{padding: "1rem"}} width="100%" height="100%" viewBox={`0 0 ${shapeData.width} ${shapeData.height}`} xmlns="http://www.w3.org/2000/svg">
								<path d={shapeData.svg} fill={shapeData.color} />
							</svg>
						</div>
					)}
				</Container>
			</AspectRatio>
		</div>
	);
};

export default SaveSlot;
