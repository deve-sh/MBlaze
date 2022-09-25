import DocRef from "./DocRef";

class FetchedDoc {
	public collectionName: string;
	public id: string;
	public ref: DocRef;
	private docData: Record<string, any> | null;

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

	get exists() {
		return !!this.docData;
	}
}

export default FetchedDoc;
