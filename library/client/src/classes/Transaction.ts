import type OpRequesterArgs from "../types/OpRequesterArgs";
import DocRef from "./DocRef";

import {
	docDeleteRequest,
	docSetRequest,
	docUpdateRequest,
} from "../requests/docRequests";
import { sendTransactionRequest } from "../utils/sendOpRequest";
import MBlazeException from "../utils/mblazeError";

class Transaction {
	operationsList: Array<OpRequesterArgs>;
	constructor() {
		this.operationsList = [];
	}

	public get(ref: DocRef) {
		return ref.get();
	}

	public update(ref: DocRef, updates: Record<string, any>) {
		docUpdateRequest(ref, updates, this.operationsList);
	}

	public set(
		ref: DocRef,
		newData: Record<string, any>,
		{ merge = false }: { merge: boolean }
	) {
		docSetRequest(ref, newData, { merge }, this.operationsList);
	}

	public delete(ref: DocRef) {
		docDeleteRequest(ref, this.operationsList);
	}

	public async save() {
		if (!this.operationsList.length)
			throw new MBlazeException(
				"Transactions require at least one update/set/delete operation."
			);
		const result = await sendTransactionRequest(this.operationsList);
		if (result.error)
			throw new MBlazeException(
				result.errorMessage || result.error.message,
				result.errorStatus,
				result.errorResponse
			);
		return result;
	}
}

export default Transaction;
