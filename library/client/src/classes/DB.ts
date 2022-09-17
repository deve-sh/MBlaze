import Collection from "./Collection";
import Doc from "./Doc";

class DB {
	private backendEndpoint: string;

	constructor(backendEndpoint: string) {
		if (!backendEndpoint)
			throw new Error("Backend Endpoint not provided at instantiation: DB");

		this.backendEndpoint = backendEndpoint;
		((global || globalThis || window) as any).mBlazeBackendendpoint =
			backendEndpoint;
	}

	public collection(collectionName: string) {
		if (!collectionName) throw new Error("Collection Name not provided.");
		return new Collection(this.backendEndpoint, collectionName);
	}

	public doc(collectionPlusDocId: string) {
		// Format: <collectionName>/<docId>
		if (!collectionPlusDocId) throw new Error("Document ID not provided.");
		if (
			!collectionPlusDocId.includes("/") &&
			collectionPlusDocId.split("/").length !== 2
		)
			throw new Error("Document ID not provided.");
		const [collectionName, docId] = collectionPlusDocId.split("/");
		return new Doc(collectionName, docId);
	}
}

export default DB;
