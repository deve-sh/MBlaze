import axios from "axios";

import type OpRequesterArgs from "../types/OpRequesterArgs";
import type { RequestConfig } from "../types/RequestCommonConfig";

import getBackendEndpoint from "./getBackendEndpoint";
import getRequestConfig from "./getRequestConfig";

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
		const errorMessage =
			errorResponse?.message || "No Response message from backend.";

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
		const requestBody: Record<string, any> = {
			collectionName,
			id,
			operation,
		};
		if (["update", "set"].includes(operation)) {
			requestBody.newData = newData;
			requestBody.merge = merge;
		}

		const { headers = {} } = getRequestConfig(args) as RequestConfig;

		const { data } = await axios.post(backendEndpoint, requestBody, {
			headers,
		});
		return handleResponse({ operation, data, id, collectionName });
	} catch (error: any) {
		return handleError(error);
	}
};

export default sendSingleOpRequest;
