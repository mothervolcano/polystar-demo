import styles from '../styles/gallery.module.css';
import { Group } from "@mantine/core";
import SaveSlot from "./SaveSlot";
import ShapeContext from '../ShapeContext';
import { useContext } from 'react';


const Gallery = () => {

	const { shapeCollection } = useContext(ShapeContext);

	return <Group grow gap={0} className={styles.gallery}>{shapeCollection.map( (item, i) => <SaveSlot key={i} num={i} placeholder={item.svg}></SaveSlot> )}</Group>
}

export default Gallery;