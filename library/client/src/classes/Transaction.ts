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
	private operationsList: Array<OpRequesterArgs>;
	private saving: boolean;
	private completed: boolean;
	constructor() {
		this.operationsList = [];
		this.saving = false;
		this.completed = false;
	}

	private canRunOps() {
		return !this.completed && !this.saving;
	}

	private logCannotRunOpsError() {
		return console.error("Transaction is processing or completed");
	}

	public get(ref: DocRef) {
		if (!this.canRunOps()) return this.logCannotRunOpsError();
		return ref.get();
	}

	public update(ref: DocRef, updates: Record<string, any>) {
		if (!this.canRunOps()) return this.logCannotRunOpsError();
		docUpdateRequest(ref, updates, this.operationsList);
	}

	public set(
		ref: DocRef,
		newData: Record<string, any>,
		{ merge = false }: { merge: boolean }
	) {
		if (!this.canRunOps()) return this.logCannotRunOpsError();
		docSetRequest(ref, newData, { merge }, this.operationsList);
	}

	public delete(ref: DocRef) {
		if (!this.canRunOps()) return this.logCannotRunOpsError();
		docDeleteRequest(ref, this.operationsList);
	}

	public async save() {
		if (!this.operationsList.length)
			throw new MBlazeException(
				"Transactions require at least one update/set/delete operation."
			);
		this.saving = true; // Lock further ops from happening.
		const result = await sendTransactionRequest(this.operationsList);
		this.saving = false;
		this.completed = true;
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
