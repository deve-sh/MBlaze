import CollectionClassConstructorArg from "../../types/collectionClassConstructorArg";
import comparatorType from "../../types/comparator";
import comparatorMap from "../../utils/comparatorMaps";

import DocRef from "../DocRef";

import BaseCollection from "./BaseCollectionRef";
import WhereCollectionRef from "./WhereCollectionRef";
import FilteredCollectionRef from "./FilteredCollectionRef";
import LimitedCollectionRef from "./LimitedCollectionRef";
import OffsetCollectionRef from "./OffsetCollectionRef";
import OrderedCollectionRef from "./OrderedCollectionRef";
import SelectFieldsFromCollectionRef from "./SelectFieldsFromCollectionRef";

class Collection extends BaseCollection {
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
		return new WhereCollectionRef({ ...this._args, filters: this._filters });
	}

	filter(filters: Record<string, any>) {
		return new FilteredCollectionRef({ ...this._args, filters: filters });
	}

	doc(docId?: string) {
		return new DocRef(this.collectionName, docId);
	}

	limit(number: number) {
		return new LimitedCollectionRef({ ...this._args, limit: number });
	}

	offset(number: number) {
		return new OffsetCollectionRef({ ...this._args, offset: number });
	}

	select(rule: Record<string, boolean | number>) {
		return new SelectFieldsFromCollectionRef({
			...this._args,
			fieldsSelectionRule: rule,
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

export default Collection;
