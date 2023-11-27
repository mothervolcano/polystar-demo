import styles from '../styles/gallery.module.css';
import { Group } from "@mantine/core";
import SaveSlot from "./SaveSlot";

interface savedShape {
	timestamp: string | null;
	svg: string | null;
}

interface GalleryProps {
	collection: savedShape[];
}


const Gallery = (props: GalleryProps) => {

	const { collection } = props;

	return <Group grow gap={0} className={styles.gallery}>{collection.map( (item, i) => <SaveSlot key={i} name={"test"} placeholder={item.svg}></SaveSlot> )}</Group>
}

export default Gallery;