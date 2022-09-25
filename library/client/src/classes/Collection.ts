import comparatorType from "../types/comparator";
import DocRef from "./DocRef";
import collectionGetRequest from "../requests/collectionGetRequest";

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

	limit(number: number) {}

	get() {
		return collectionGetRequest({
			filters: {},
			collectionName: this.collectionName,
		});
	}
}

export default Collection;
