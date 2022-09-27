import Collection from "./CollectionClasses/Collection";
import DocRef from "./DocRef";
import setBackendEndpoint from "../utils/setBackendEndpoint";
import type RequestCommonConfig from "../types/RequestCommonConfig";
import setRequestConfig from "../utils/setRequestConfig";
import type TransactionCallback from "../types/TransactionCallback";
import Transaction from "./Transaction";

class DB {
	constructor(backendEndpoint: string, requestConfig?: RequestCommonConfig) {
		if (!backendEndpoint)
			throw new Error("Backend Endpoint not provided at instantiation: DB");

		setBackendEndpoint(backendEndpoint);
		setRequestConfig(requestConfig || { headers: {} });
	}

	public collection(collectionName: string) {
		if (!collectionName) throw new Error("Collection Name not provided.");
		return new Collection({ collectionName });
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
		return new DocRef(collectionName, docId);
	}

	public runTransaction(callback: TransactionCallback) {
		const transaction = new Transaction();
		return callback(transaction);
	}
}

export default DB;
