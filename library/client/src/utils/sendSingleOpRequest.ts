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

interface opReturnType {
	response: Record<string, any> | null;
	error: Record<string, any> | null;
	errorResponse?: Record<string, any>;
	errorMessage?: string;
	errorStatus?: number;
	appLevelError?: boolean;
	noResponse?: boolean;
}

const handleError = (error: any): opReturnType => {
	if (error.response) {
		const errorResponse = error.response.data;
		const errorStatus = error.response.status;
		const errorMessage = errorResponse.message;

		return { response: null, error, errorResponse, errorStatus, errorMessage };
	} else if (error.request) {
		return {
			response: null,
			error,
			noResponse: true,
			errorMessage: "No response was received from the database",
		};
	} else {
		return {
			response: null,
			error,
			appLevelError: true,
			errorMessage: error.message,
		};
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
		return {
			error: null,
			response: { data: data.document || null, id, collectionName },
		};
	if (operation === "list")
		return {
			error: null,
			response: { docs: data.documents || [], limit, offset },
		};
	return { error: null, response: {} };
};

const sendSingleOpRequest = async (
	args: OpRequesterArgs
): Promise<opReturnType> => {
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
