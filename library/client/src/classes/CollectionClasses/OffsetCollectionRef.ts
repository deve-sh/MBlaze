import CollectionClassConstructorArg from "../../types/collectionClassConstructorArg";
import BaseCollection from "./BaseCollectionRef";
import OrderedCollectionRef from "./OrderedCollectionRef";
import SelectFieldsFromCollectionRef from "./SelectFieldsFromCollectionRef";

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

	select(rule: Record<string, boolean | number>) {
		return new SelectFieldsFromCollectionRef({
			...this._args,
			fieldsSelectionRule: rule,
		});
	}
}

export default OffsetCollectionRef;
