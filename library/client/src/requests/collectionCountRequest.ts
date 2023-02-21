import MBlazeException from "../utils/mblazeError";
import { sendSingleOpRequest } from "../utils/sendOpRequest";

interface CollectionCountRequestArg {
	collectionName: string;
	filters?: Record<string, any>;
}

const collectionCountRequest = async ({
	collectionName,
	filters = {},
}: CollectionCountRequestArg) => {
	const result = await sendSingleOpRequest({
		operation: "count",
		filters,
		collectionName,
	});
	if (result.error)
		throw new MBlazeException(
			result.errorMessage || result.error.message,
			result.errorStatus,
			result.errorResponse
		);
	return { count: result.response?.count || 0 };
};

export default collectionCountRequest;
