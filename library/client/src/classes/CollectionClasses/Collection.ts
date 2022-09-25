import CollectionClassConstructorArg from "../../types/collectionClassConstructorArg";
import comparatorType from "../../types/comparator";

import BaseCollection from "./BaseCollectionRef";
import DocRef from "../DocRef";
import LimitedCollectionRef from "./LimitedCollectionRef";
import OffsetCollectionRef from "./OffsetCollectionRef";
import WhereCollectionRef from "./WhereCollectionRef";

class Collection extends BaseCollection {
	private _args: CollectionClassConstructorArg;
	constructor(args: CollectionClassConstructorArg) {
		super(args);
		this._args = args;
	}

	where(fieldName: string, comparator: comparatorType, value: any) {
		const conditionFragment = { [fieldName]: { comparator, value } };
		if (!this._filters["$and"]) {
			this._filters.$and = [conditionFragment];
		} else this._filters.$and.push(conditionFragment);
		return new WhereCollectionRef({ ...this._args, filters: this._filters });
	}

	doc(docId: string) {
		return new DocRef(this.collectionName, docId);
	}

	limit(number: number) {
		return new LimitedCollectionRef({ ...this._args, limit: number });
	}

	offset(number: number) {
		return new OffsetCollectionRef({ ...this._args, offset: number });
	}
}

export default Collection;
