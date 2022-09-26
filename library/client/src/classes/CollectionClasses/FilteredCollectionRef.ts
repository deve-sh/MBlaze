import CollectionClassConstructorArg from "../../types/collectionClassConstructorArg";

import BaseCollection from "./BaseCollectionRef";
import LimitedCollectionRef from "./LimitedCollectionRef";
import OffsetCollectionRef from "./OffsetCollectionRef";
import OrderedCollectionRef from "./OrderedCollectionRef";

class FilteredCollectionRef extends BaseCollection {
	private _args: CollectionClassConstructorArg;
	constructor(args: CollectionClassConstructorArg) {
		super(args);
		this._args = args;
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

	orderBy(field: string, sortOrder: "asc" | "desc" = "asc") {
		return new OrderedCollectionRef({
			...this._args,
			sortByField: field,
			sortOrder,
		});
	}
}

export default FilteredCollectionRef;
