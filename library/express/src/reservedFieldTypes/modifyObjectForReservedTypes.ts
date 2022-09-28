import increment, { INCREMENT_OP_CODE, INCREMENT_TYPE } from "./increment";
import { SERVER_TIMESTAMP_TYPE } from "./serverTimestamp";
import arrayRemove, {
	ARRAY_REMOVE_OP_CODE,
	ARRAY_REMOVE_TYPE,
} from "./arrayRemove";
import arrayUnion, {
	ARRAY_UNION_OP_CODE,
	ARRAY_UNION_TYPE,
} from "./arrayUnion";
import fieldDelete, {
	FIELD_DELETE_TYPE,
	FIELD_DELETE_OP_CODE,
} from "./fieldDelete";

const modifyObjectForReservedFieldTypes = (
	obj: Record<string, any>,
	considerTypes = [
		// Only server timestamp supported in case of set operations
		SERVER_TIMESTAMP_TYPE,
		INCREMENT_TYPE,
		ARRAY_REMOVE_TYPE,
		ARRAY_UNION_TYPE,
		FIELD_DELETE_TYPE,
	],
	rootObj?: Record<string, any>,
	currentKey?: string,
	deleteEmptyRemainderObjects = true
) => {
	if (!rootObj) rootObj = obj;

	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			const currentKeyChain = currentKey ? `${currentKey}.${key}` : key;
			if (
				obj[key]?.type === SERVER_TIMESTAMP_TYPE &&
				considerTypes.includes(SERVER_TIMESTAMP_TYPE)
			)
				obj[key] = new Date(); // Server Timestamp
			else if (
				obj[key]?.type === INCREMENT_TYPE &&
				considerTypes.includes(INCREMENT_TYPE)
			) {
				if (rootObj[INCREMENT_OP_CODE])
					rootObj[INCREMENT_OP_CODE] = {
						...rootObj[INCREMENT_OP_CODE],
						...increment(currentKeyChain, obj[key].by),
					};
				else
					rootObj[INCREMENT_OP_CODE] = increment(currentKeyChain, obj[key].by);
				delete obj[key];
			} else if (
				obj[key]?.type === ARRAY_UNION_TYPE &&
				considerTypes.includes(ARRAY_UNION_TYPE)
			) {
				if (rootObj[ARRAY_UNION_OP_CODE])
					rootObj[ARRAY_UNION_OP_CODE] = {
						...rootObj[ARRAY_UNION_OP_CODE],
						...arrayUnion(currentKeyChain, obj[key].toInsert),
					};
				else
					rootObj[ARRAY_UNION_OP_CODE] = arrayUnion(
						currentKeyChain,
						obj[key].toInsert
					);
				delete obj[key];
			} else if (
				obj[key]?.type === ARRAY_REMOVE_TYPE &&
				considerTypes.includes(ARRAY_REMOVE_TYPE)
			) {
				if (rootObj[ARRAY_REMOVE_OP_CODE])
					rootObj[ARRAY_REMOVE_OP_CODE] = {
						...rootObj[ARRAY_REMOVE_OP_CODE],
						...arrayRemove(currentKeyChain, obj[key].toRemove),
					};
				else
					rootObj[ARRAY_REMOVE_OP_CODE] = arrayRemove(
						currentKeyChain,
						obj[key].toRemove
					);
				delete obj[key];
			} else if (
				obj[key]?.type === FIELD_DELETE_TYPE &&
				considerTypes.includes(FIELD_DELETE_TYPE)
			) {
				if (rootObj[FIELD_DELETE_OP_CODE])
					rootObj[FIELD_DELETE_OP_CODE] = {
						...rootObj[FIELD_DELETE_OP_CODE],
						...fieldDelete(currentKeyChain),
					};
				else rootObj[FIELD_DELETE_OP_CODE] = fieldDelete(currentKeyChain);
				delete obj[key];
			} else if (obj[key] && typeof obj[key] === "object") {
				modifyObjectForReservedFieldTypes(
					obj[key],
					considerTypes,
					rootObj,
					currentKeyChain
				);
				if (!Object.keys(obj[key]).length && deleteEmptyRemainderObjects)
					delete obj[key];
			}
		}
	}

	return rootObj;
};

export default modifyObjectForReservedFieldTypes;
