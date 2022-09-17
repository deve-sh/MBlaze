class Collection {
	private backendEndpoint: string;
	private collectionName: string;

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
}

export default Collection;
