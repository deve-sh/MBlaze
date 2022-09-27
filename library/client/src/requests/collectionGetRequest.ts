import FetchedCollection from "../classes/FetchedCollection";
import MBlazeException from "../utils/mblazeError";
import sendSingleOpRequest from "../utils/sendSingleOpRequest";

interface CollectionGetRequestArg {
	collectionName: string;
	filters?: Record<string, any>;
	limit?: number;
	offset?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

const collectionGetRequest = async ({
	collectionName,
	filters = {},
	limit = 100,
	offset = 0,
	sortBy,
	sortOrder = "asc",
}: CollectionGetRequestArg) => {
	const result = await sendSingleOpRequest({
		operation: "list",
		filters,
		collectionName,
		limit,
		offset,
		sortBy,
		sortOrder,
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
