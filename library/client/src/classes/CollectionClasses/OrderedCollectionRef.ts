import CollectionClassConstructorArg from "../../types/collectionClassConstructorArg";
import BaseCollection from "./BaseCollectionRef";
import SelectFieldsFromCollectionRef from "./SelectFieldsFromCollectionRef";

class OrderedCollectionRef extends BaseCollection {
	private _args: CollectionClassConstructorArg;

	constructor(args: CollectionClassConstructorArg) {
		super(args);
		this._args = args;
	}

	select(rule: Record<string, boolean | number>) {
		return new SelectFieldsFromCollectionRef({
			...this._args,
			fieldsSelectionRule: rule,
		});
	}
}

export default OrderedCollectionRef;
