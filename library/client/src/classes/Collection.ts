import comparatorType from "../types/comparator";
import sendSingleOpRequest from "../utils/sendSingleOpRequest";
import DocRef from "./DocRef";
import FetchedCollection from "./FetchedCollection";

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

	async get() {
		const result = await sendSingleOpRequest({
			operation: "list",
			filters: {},
			collectionName: this.collectionName,
		});
		if (result.error) throw new Error(result.errorMessage);
		return new FetchedCollection(
			this.collectionName,
			result.response?.docs || []
		);
	}
}

export default Collection;
