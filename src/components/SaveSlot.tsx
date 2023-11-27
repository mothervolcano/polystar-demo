import { AspectRatio, Button, Container } from "@mantine/core";
import { useContext } from "react";
import ShapeContext from "../ShapeContext";

interface SaveSlotProps {
	num: number;
	placeholder: any;
}

const SaveSlot = (props: SaveSlotProps) => {
	const { num, placeholder } = props;

	const {shapeCollection, setShapeCollection} = useContext(ShapeContext);

	console.log("SVG data: ", placeholder);

	const onDelete = (event: React.MouseEvent<HTMLButtonElement>) => {

		console.log('DELETE SHAPE: ', event.currentTarget.value);

		const updatedCollection = shapeCollection.slice();
		updatedCollection[Number(event.currentTarget.value)] = { timestamp: null, svg: null };

		setShapeCollection(updatedCollection);
	}

	return (
		<div>
			<AspectRatio ratio={1 / 1}>
				<Container>
					{placeholder && (<Button variant="default" size="xs" value={num} style={{position: "absolute", bottom: "1rem", right: "1rem"}} onClick={(event) => onDelete(event)}>Delete</Button>)}
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
