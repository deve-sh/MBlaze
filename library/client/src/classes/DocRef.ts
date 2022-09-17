class Doc {
	public collectionName: string;
	public id: string;

	constructor(collectionName: string, docId: string) {
		if (!collectionName)
			throw new Error("Collection Name not provided at instantiation: Doc");

		if (!docId)
			throw new Error("Document ID not provided at instantiation: Doc");

		this.collectionName = collectionName;
		this.id = docId;
	}

	get() {}

	set() {}

	update() {}

	delete() {}
}

export default Doc;
