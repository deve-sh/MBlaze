import comparatorType from "../types/comparator";
import DocRef from "./DocRef";

class Collection {
	private collectionName: string;
	private docId?: string = undefined;

	constructor(collectionName: string) {
		if (!collectionName)
			throw new Error(
				"Collection Name not provided at instantiation: Collection"
			);

		this.collectionName = collectionName;
	}

	where(fieldName: string, comparator: comparatorType, value: any) {}

	doc(docId: string) {
		this.docId = docId;
		return new DocRef(this.collectionName, this.docId);
	}

	get() {}
}

export default Collection;
