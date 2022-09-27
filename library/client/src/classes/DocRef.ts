import ObjectId from "bson-objectid";
import FetchedDoc from "./FetchedDoc";
import sendSingleOpRequest from "../utils/sendSingleOpRequest";
import MBlazeException from "../utils/mblazeError";

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
		const result = await sendSingleOpRequest({
			operation: "get",
			id: this.id,
			collectionName: this.collectionName,
		});
		if (result.error && result.errorStatus !== 404)
			throw new MBlazeException(
				result.errorMessage || result.error.message,
				result.errorStatus,
				result.errorResponse
			);
		return new FetchedDoc(
			this.collectionName,
			this.id,
			result.errorStatus === 404 ? null : result.response?.data || null
		);
	}

	async set(newData: Record<string, any>, { merge }: { merge: boolean }) {
		const result = await sendSingleOpRequest({
			operation: "set",
			id: this.id,
			collectionName: this.collectionName,
			newData,
			merge,
		});
		if (result.error)
			throw new MBlazeException(
				result.errorMessage || result.error.message,
				result.errorStatus,
				result.errorResponse
			);
	}

	async update(updates: Record<string, any>) {
		const result = await sendSingleOpRequest({
			operation: "update",
			id: this.id,
			collectionName: this.collectionName,
			newData: updates,
		});
		if (result.error)
			throw new MBlazeException(
				result.errorMessage || result.error.message,
				result.errorStatus,
				result.errorResponse
			);
	}

	async delete() {
		const result = await sendSingleOpRequest({
			operation: "delete",
			id: this.id,
			collectionName: this.collectionName,
		});
		if (result.error)
			throw new MBlazeException(
				result.errorMessage || result.error.message,
				result.errorStatus,
				result.errorResponse
			);
	}
}

export default DocRef;
