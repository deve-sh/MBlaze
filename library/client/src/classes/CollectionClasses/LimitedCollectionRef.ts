import CollectionClassConstructorArg from "../../types/collectionClassConstructorArg";
import BaseCollection from "./BaseCollectionRef";
import OffsetCollectionRef from "./OffsetCollectionRef";
import OrderedCollectionRef from "./OrderedCollectionRef";

class LimitedCollectionRef extends BaseCollection {
	private _args: CollectionClassConstructorArg;

	constructor(args: CollectionClassConstructorArg) {
		super(args);
		this._args = args;
	}

	offset(number: number) {
		return new OffsetCollectionRef({ ...this._args, offset: number });
	}

	orderBy(field: string, sortOrder: "asc" | "desc" = "asc") {
		return new OrderedCollectionRef({
			...this._args,
			sortByField: field,
			sortOrder,
		});
	}
}

export default LimitedCollectionRef;
