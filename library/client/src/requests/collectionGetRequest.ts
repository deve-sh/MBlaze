import FetchedCollection from "../classes/FetchedCollection";
import MBlazeException from "../utils/mblazeError";
import { sendSingleOpRequest } from "../utils/sendOpRequest";

interface CollectionGetRequestArg {
	collectionName: string;
	filters?: Record<string, any>;
	limit?: number;
	offset?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	fieldsSelectionRule?: Record<string, boolean | number>;
}

const collectionGetRequest = async ({
	collectionName,
	filters = {},
	limit = 100,
	offset = 0,
	sortBy,
	sortOrder = "asc",
	fieldsSelectionRule,
}: CollectionGetRequestArg) => {
	const result = await sendSingleOpRequest({
		operation: "list",
		filters,
		collectionName,
		limit,
		offset,
		sortBy,
		sortOrder,
		fieldsSelectionRule,
	});
	if (result.error)
		throw new MBlazeException(
			result.errorMessage || result.error.message,
			result.errorStatus,
			result.errorResponse
		);
	return new FetchedCollection(collectionName, result.response?.docs || []);
};

export default collectionGetRequest;
