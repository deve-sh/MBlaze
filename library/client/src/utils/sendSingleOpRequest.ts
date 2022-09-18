import axios from "axios";
import operations from "../types/operations";
import getBackendEndpoint from "./getBackendEndpoint";

interface OpRequesterArgs {
	operation: operations;
	collectionName: string;
	id?: string;
	filters?: Record<string, any> | null;
	newData?: Record<string, any> | null;
	limit?: number;
	offset?: number;
	merge?: boolean;
}

const handleError = (error: any) => {
	if (error.response) {
		const errorResponse = error.response.data;
		const errorStatus = error.response.status;
		const errorMessage = errorResponse.message;

		return { error, errorResponse, errorStatus, errorMessage };
	} else if (error.request) {
		return { error, noResponse: true };
	} else {
		return { error, appLevelError: true };
	}
};

interface HandleResponseArgs extends OpRequesterArgs {
	data?: any;
}

const handleResponse = ({
	operation,
	data,
	id,
	collectionName,
	limit,
	offset,
}: HandleResponseArgs) => {
	if (operation === "get")
		return { response: { data: data.document || null, id, collectionName } };
	if (operation === "list")
		return { response: { docs: data.documents || [], limit, offset } };
	return { response: {} };
};

const sendSingleOpRequest = async (args: OpRequesterArgs) => {
	const { operation, newData, id, collectionName, merge } = args;
	try {
		const backendEndpoint = getBackendEndpoint();
		if (!backendEndpoint)
			throw new Error(
				"Backend endpoint not specified, please specify backend endpoint first using new MBlaze.DB(<backendEndpoint>)"
			);
		const requestBody: Record<string, any> = {};
		if (["update", "set"].includes(operation)) {
			requestBody.newData = newData;
			requestBody.merge = merge;
		}

		const { data } = await axios.post(backendEndpoint, requestBody);
		return handleResponse({ operation, data, id, collectionName });
	} catch (error: any) {
		return handleError(error);
	}
};

export default sendSingleOpRequest;
