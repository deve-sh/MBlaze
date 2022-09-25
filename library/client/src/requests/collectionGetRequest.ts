import FetchedCollection from "../classes/FetchedCollection";
import sendSingleOpRequest from "../utils/sendSingleOpRequest";

interface CollectionGetRequestArg {
	collectionName: string;
	filters?: Record<string, any>;
	limit?: number;
	offset?: number;
}

const collectionGetRequest = async ({
	collectionName,
	filters = {},
	limit = 100,
	offset = 0,
}: CollectionGetRequestArg) => {
	const result = await sendSingleOpRequest({
		operation: "list",
		filters,
		collectionName,
		limit,
		offset,
	});
	if (result.error) throw new Error(result.errorMessage);
	return new FetchedCollection(collectionName, result.response?.docs || []);
};

export default collectionGetRequest;
