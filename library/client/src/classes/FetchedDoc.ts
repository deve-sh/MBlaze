import DocRef from "./DocRef";

class FetchedDoc {
	public collectionName: string;
	public id: string;
	public docData: Record<string, any> | null;
	public ref: DocRef;

	constructor(
		collectionName: string,
		docId: string,
		data: Record<string, any> | null
	) {
		this.collectionName = collectionName;
		this.id = docId;
		this.docData = data;
		this.ref = new DocRef(collectionName, docId);
	}

	data() {
		return this.docData;
	}

	exists() {
		return !!this.docData;
	}
}

export default FetchedDoc;
