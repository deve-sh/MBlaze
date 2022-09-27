import type OpRequesterArgs from "../types/OpRequesterArgs";
import DocRef from "./DocRef";

class Transaction {
	operationsList: Array<OpRequesterArgs>;
	constructor() {
		this.operationsList = [];
	}

	public get(ref: DocRef) {}

	public update(ref: DocRef, updates: Record<string, any>) {}

	public set(
		ref: DocRef,
		newData: Record<string, any>,
		{ merge }: { merge: boolean }
	) {}

	public delete(ref: DocRef) {}

	public save() {}
}

export default Transaction;
