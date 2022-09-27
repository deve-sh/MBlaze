import DocRef from "../classes/DocRef";
import FetchedDoc from "../classes/FetchedDoc";

import sendSingleOpRequest from "../utils/sendSingleOpRequest";
import MBlazeException from "../utils/mblazeError";
import OpRequesterArgs from "../types/OpRequesterArgs";

export const docGetRequest = async (docRef: DocRef) => {
	const result = await sendSingleOpRequest({
		operation: "get",
		id: docRef.id,
		collectionName: docRef.collectionName,
	});
	if (result.error && result.errorStatus !== 404)
		throw new MBlazeException(
			result.errorMessage || result.error.message,
			result.errorStatus,
			result.errorResponse
		);
	return new FetchedDoc(
		docRef.collectionName,
		docRef.id,
		result.errorStatus === 404 ? null : result.response?.data || null
	);
};

export const docUpdateRequest = async (
	docRef: DocRef,
	updates: Record<string, any>,
	operationList?: Array<OpRequesterArgs>
) => {
	const operation = {
		operation: "update",
		id: docRef.id,
		collectionName: docRef.collectionName,
		newData: updates,
	} as OpRequesterArgs;
	if (operationList) return operationList.push(operation);

	const result = await sendSingleOpRequest(operation);
	if (result.error)
		throw new MBlazeException(
			result.errorMessage || result.error.message,
			result.errorStatus,
			result.errorResponse
		);
	return result;
};

export const docDeleteRequest = async (
	docRef: DocRef,
	operationList?: Array<OpRequesterArgs>
) => {
	const operation = {
		operation: "delete",
		id: docRef.id,
		collectionName: docRef.collectionName,
	} as OpRequesterArgs;
	if (operationList) return operationList.push(operation);

	const result = await sendSingleOpRequest(operation);
	if (result.error)
		throw new MBlazeException(
			result.errorMessage || result.error.message,
			result.errorStatus,
			result.errorResponse
		);
	return result;
};

export const docSetRequest = async (
	docRef: DocRef,
	newData: Record<string, any>,
	options?: { merge: boolean },
	operationsList?: Array<OpRequesterArgs>
) => {
	const { merge = false } = options || {};
	const operation = {
		operation: "set",
		id: docRef.id,
		collectionName: docRef.collectionName,
		newData,
		merge,
	} as OpRequesterArgs;
	if (operationsList) return operationsList.push(operation);

	const result = await sendSingleOpRequest(operation);
	if (result.error)
		throw new MBlazeException(
			result.errorMessage || result.error.message,
			result.errorStatus,
			result.errorResponse
		);
	return result;
};
