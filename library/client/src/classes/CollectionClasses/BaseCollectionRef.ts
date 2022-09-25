import type CollectionClassConstructorArg from "../../types/collectionClassConstructorArg";

import collectionGetRequest from "../../requests/collectionGetRequest";

class BaseCollection {
	collectionName: string;
	_filters: Record<string, any> = {};
	_limit: number = 100;
	_offset: number = 0;
	_sortOrder: string = "asc";
	_sortByField: string | undefined | null = null;

	constructor({
		collectionName,
		limit = 100,
		offset = 0,
		filters = {},
		sortByField,
		sortOrder = "asc",
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
	}

	get() {
		return collectionGetRequest({
			filters: this._filters,
			collectionName: this.collectionName,
			limit: this._limit,
			offset: this._offset,
		});
	}
}

export default BaseCollection;
