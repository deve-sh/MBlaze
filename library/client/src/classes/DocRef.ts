import ObjectId from "bson-objectid";

import {
	docDeleteRequest,
	docGetRequest,
	docSetRequest,
	docUpdateRequest,
} from "../requests/docRequests";

class DocRef {
	public collectionName: string;
	public id: string;
	public deleted: boolean = false;

	constructor(collectionName: string, docId?: string) {
		if (!collectionName)
			throw new Error("Collection Name not provided at instantiation: Doc");

		this.collectionName = collectionName;
		this.id = docId || new ObjectId().id.toString();
	}

	async get() {
		return docGetRequest(this);
	}

	async set(
		newData: Record<string, any>,
		{ merge = false }: { merge: boolean }
	) {
		return docSetRequest(this, newData, { merge });
	}

	async update(updates: Record<string, any>) {
		return docUpdateRequest(this, updates);
	}

	async delete() {
		return docDeleteRequest(this);
	}
}

export default DocRef;
