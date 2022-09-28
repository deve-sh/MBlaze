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

const modifyObjectForReservedFieldTypes = (
	obj: Record<string, any>,
	rootObj?: Record<string, any>
) => {
	if (!rootObj) rootObj = obj;

	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (obj[key]?.type === SERVER_TIMESTAMP_TYPE)
				obj[key] = new Date(); // Server Timestamp
			else if (obj[key]?.type === INCREMENT_TYPE) {
				if (rootObj[INCREMENT_OP_CODE])
					rootObj[INCREMENT_OP_CODE] = {
						...rootObj[INCREMENT_OP_CODE],
						...increment(key, obj[key].by),
					};
				else rootObj[INCREMENT_OP_CODE] = increment(key, obj[key].by);
			} else if (obj[key]?.type === ARRAY_UNION_TYPE) {
				if (rootObj[ARRAY_UNION_OP_CODE])
					rootObj[ARRAY_UNION_OP_CODE] = {
						...rootObj[ARRAY_UNION_OP_CODE],
						...arrayUnion(key, obj[key].toAdd),
					};
				else rootObj[ARRAY_UNION_OP_CODE] = arrayUnion(key, obj[key].toAdd);
			} else if (obj[key]?.type === ARRAY_REMOVE_TYPE) {
				if (rootObj[ARRAY_REMOVE_OP_CODE])
					rootObj[ARRAY_REMOVE_OP_CODE] = {
						...rootObj[ARRAY_REMOVE_OP_CODE],
						...arrayRemove(key, obj[key].toRemove),
					};
				else
					rootObj[ARRAY_REMOVE_OP_CODE] = arrayRemove(key, obj[key].toRemove);
			} else if (obj[key] && typeof obj[key] === "object")
				modifyObjectForReservedFieldTypes(obj[key], rootObj);
		}
	}

	return rootObj;
};

export default modifyObjectForReservedFieldTypes;
