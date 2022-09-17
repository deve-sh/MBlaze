class Doc {
	private backendEndpoint: string;
	public collectionName: string;
	public id: string;

	constructor(backendEndpoint: string, collectionName: string, docId: string) {
		if (!backendEndpoint)
			throw new Error("Backend Endpoint not provided at instantiation: Doc");

		if (!collectionName)
			throw new Error("Collection Name not provided at instantiation: Doc");

		if (!docId)
			throw new Error("Document ID not provided at instantiation: Doc");

		this.backendEndpoint = backendEndpoint;
		this.collectionName = collectionName;
		this.id = docId;
	}

	get() {}

	set() {}

	update() {}

	delete() {}
}

export default Doc;
