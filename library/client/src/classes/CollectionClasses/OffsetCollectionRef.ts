import CollectionClassConstructorArg from "../../types/collectionClassConstructorArg";
import BaseCollection from "./BaseCollectionRef";
import OrderedCollectionRef from "./OrderedCollectionRef";

class OffsetCollectionRef extends BaseCollection {
	private _args: CollectionClassConstructorArg;

	constructor(args: CollectionClassConstructorArg) {
		super(args);
		this._args = args;
	}

	orderBy(field: string, sortOrder: "asc" | "desc" = "asc") {
		return new OrderedCollectionRef({
			...this._args,
			sortByField: field,
			sortOrder,
		});
	}
}

export default OffsetCollectionRef;
