import CollectionClassConstructorArg from "../../types/collectionClassConstructorArg";
import comparatorType from "../../types/comparator";
import comparatorMap from "../../utils/comparatorMaps";

import BaseCollection from "./BaseCollectionRef";
import LimitedCollectionRef from "./LimitedCollectionRef";
import OffsetCollectionRef from "./OffsetCollectionRef";

class WhereCollectionRef extends BaseCollection {
	private _args: CollectionClassConstructorArg;
	constructor(args: CollectionClassConstructorArg) {
		super(args);
		this._args = args;
	}

	where(fieldName: string, comparator: comparatorType, value: any) {
		const conditionFragment = { [fieldName]: comparatorMap(comparator, value) };
		if (!this._filters["$and"]) {
			this._filters.$and = [conditionFragment];
		} else this._filters.$and.push(conditionFragment);
		return this;
	}

	limit(number: number) {
		return new LimitedCollectionRef({
			...this._args,
			filters: this._filters,
			limit: number,
		});
	}

	offset(number: number) {
		return new OffsetCollectionRef({
			...this._args,
			offset: number,
			filters: this._filters,
		});
	}
}

export default WhereCollectionRef;
