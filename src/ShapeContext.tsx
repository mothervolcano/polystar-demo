import { createContext, ReactNode, useState } from "react";

interface SavedShape {
	timestamp: string | null;
	svg: string | null;
	width: number | null;
	height: number | null;
}

interface ShapeContextType {
	shapeCollection: SavedShape[];
	setShapeCollection: (shapes: SavedShape[]) => void;
}

interface ContextProps {
	children: ReactNode;
}

const initCollection: SavedShape[] = new Array(6).fill({ timestamp: null, svg: null, widht: null, height: null });

const ShapeContext = createContext<ShapeContextType>({ shapeCollection: initCollection, setShapeCollection: () => {} });

export const ShapeContextProvider = (props: ContextProps) => {
	const [shapeCollection, setShapeCollection] = useState<SavedShape[]>(initCollection);
	return (
		<ShapeContext.Provider value={{ shapeCollection, setShapeCollection }}>{props.children}</ShapeContext.Provider>
	);
};

export default ShapeContext;
