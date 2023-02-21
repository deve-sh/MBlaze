import axios from "axios";

import type OpRequesterArgs from "../types/OpRequesterArgs";
import type { RequestConfig } from "../types/RequestCommonConfig";

import getBackendEndpoint from "./getBackendEndpoint";
import getRequestConfig from "./getRequestConfig";

export interface opReturnType {
	response: Record<string, any> | null;
	error: Record<string, any> | null;
	errorResponse?: Record<string, any>;
	errorMessage?: string;
	errorStatus?: number;
	appLevelError?: boolean;
	noResponse?: boolean;
	errorRetryable?: boolean;
}

const handleError = (error: any): opReturnType => {
	if (error.response) {
		const errorResponse = error.response.data;
		const errorStatus = error.response.status;
		const errorMessage =
			errorResponse?.message || "No Response message from backend.";

		return {
			response: null,
			error,
			errorResponse,
			errorStatus,
			errorMessage,
			errorRetryable: false,
		};
	} else if (error.request) {
		return {
			response: null,
			errorRetryable: true,
			error,
			noResponse: true,
			errorMessage: "No response was received from the database",
		};
	} else {
		return {
			response: null,
			errorRetryable: true,
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

export const sendSingleOpRequest = async (
	args: OpRequesterArgs,
	tryCount?: number
): Promise<opReturnType> => {
	const {
		operation,
		newData,
		filters,
		limit,
		offset,
		id,
		collectionName,
		merge,
		sortOrder,
		sortBy,
		fieldsSelectionRule,
	} = args;
	tryCount = tryCount || 0;
	const requestConfig = getRequestConfig(args) as RequestConfig;
	try {
		const backendEndpoint = tryCount
			? requestConfig.fallbackURL
			: getBackendEndpoint();
		if (!backendEndpoint)
			throw new Error(
				"Backend endpoint not specified, please specify backend endpoint first using new MBlaze.DB(<backendEndpoint>)"
			);
		const requestBody: Record<string, any> = {
			collectionName,
			id,
			operation,
			filters,
			limit,
			offset,
		};
		if (fieldsSelectionRule && Object.keys(fieldsSelectionRule).length)
			requestBody.fieldsSelectionRule = fieldsSelectionRule;
		if (sortBy) {
			requestBody.sortBy = sortBy;
			requestBody.sortOrder = sortOrder;
		}
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
		const errorHandled = handleError(error);

		if (errorHandled.errorRetryable && requestConfig.fallbackURL && !tryCount) {
			return sendSingleOpRequest(args, tryCount + 1);
		}

		return errorHandled;
	}
};

export const sendTransactionRequest = async (
	args: Array<OpRequesterArgs>,
	tryCount?: number
): Promise<opReturnType> => {
	tryCount = tryCount || 0;
	const requestConfig = getRequestConfig(args) as RequestConfig;
	try {
		const backendEndpoint = tryCount
			? requestConfig.fallbackURL
			: getBackendEndpoint();
		if (!backendEndpoint)
			throw new Error(
				"Backend endpoint not specified, please specify backend endpoint first using new MBlaze.DB(<backendEndpoint>)"
			);
		const requestBody: Array<Record<string, any>> = args;

		const { headers = {} } = requestConfig;

		const { data } = await axios.post(backendEndpoint, requestBody, {
			headers,
		});
		return data;
	} catch (error: any) {
		const errorHandled = handleError(error);

		if (errorHandled.errorRetryable && requestConfig.fallbackURL && !tryCount) {
			return sendTransactionRequest(args, tryCount + 1);
		}

		return errorHandled;
	}
};
