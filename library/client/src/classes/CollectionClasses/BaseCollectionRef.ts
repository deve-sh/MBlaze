import type CollectionClassConstructorArg from "../../types/collectionClassConstructorArg";

import collectionGetRequest from "../../requests/collectionGetRequest";
import collectionCountRequest from "../../requests/collectionCountRequest";

class BaseCollection {
	collectionName: string;
	_filters: Record<string, any> = {};
	_limit: number = 100;
	_offset: number = 0;
	_sortOrder: "asc" | "desc" = "asc";
	_sortByField: string | undefined | null = null;
	_fieldsSelectionRule: Record<string, boolean | number> = {};

	constructor({
		collectionName,
		limit = 100,
		offset = 0,
		filters = {},
		sortByField,
		sortOrder = "asc",
		fieldsSelectionRule = {},
	}: CollectionClassConstructorArg) {
		if (!collectionName)
			throw new Error(
				"Collection Name not provided at instantiation: Collection"
			);

		this.collectionName = collectionName;
		this._filters = filters;
		this._limit = limit;
		this._offset = offset;
		this._sortByField = sortByField;
		this._sortOrder = sortOrder;
		this._fieldsSelectionRule = fieldsSelectionRule;
	}

	get() {
		return collectionGetRequest({
			filters: this._filters,
			collectionName: this.collectionName,
			limit: this._limit,
			offset: this._offset,
			sortBy: this._sortByField || undefined,
			sortOrder: this._sortOrder,
		});
	}

	count() {
		return collectionCountRequest({
			filters: this._filters,
			collectionName: this.collectionName,
		});
	}
}

export default BaseCollection;
