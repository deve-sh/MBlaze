import comparatorType from "../types/comparator";
import Doc from "./Doc";

class Collection {
	private backendEndpoint: string;
	private collectionName: string;
	private docId?: string = undefined;

	constructor(backendEndpoint: string, collectionName: string) {
		if (!backendEndpoint)
			throw new Error(
				"Backend Endpoint not provided at instantiation: Collection"
			);

		if (!collectionName)
			throw new Error(
				"Collection Name not provided at instantiation: Collection"
			);

		this.backendEndpoint = backendEndpoint;
		this.collectionName = collectionName;
	}

	where(fieldName: string, comparator: comparatorType, value: any) {}

	doc(docId: string) {
		this.docId = docId;
		return new Doc(this.backendEndpoint, this.collectionName, this.docId);
	}

	get() {}
}

export default Collection;
