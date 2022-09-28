import { ARRAY_REMOVE_OP_CODE } from "./arrayRemove";
import { ARRAY_UNION_OP_CODE } from "./arrayUnion";
import { FIELD_DELETE_OP_CODE } from "./fieldDelete";
import { INCREMENT_OP_CODE } from "./increment";

const getOpCodeBasedFieldsForUpdate = (obj: Record<string, any>) => {
	const objToReturn: Record<string, any> = {};

	if (obj[ARRAY_UNION_OP_CODE]) {
		objToReturn[ARRAY_UNION_OP_CODE] = obj[ARRAY_UNION_OP_CODE];
		delete obj[ARRAY_UNION_OP_CODE];
	}

	if (obj[ARRAY_REMOVE_OP_CODE]) {
		objToReturn[ARRAY_REMOVE_OP_CODE] = obj[ARRAY_REMOVE_OP_CODE];
		delete obj[ARRAY_REMOVE_OP_CODE];
	}

	if (obj[INCREMENT_OP_CODE]) {
		objToReturn[INCREMENT_OP_CODE] = obj[INCREMENT_OP_CODE];
		delete obj[INCREMENT_OP_CODE];
	}

	if (obj[FIELD_DELETE_OP_CODE]) {
		objToReturn[FIELD_DELETE_OP_CODE] = obj[FIELD_DELETE_OP_CODE];
		delete obj[FIELD_DELETE_OP_CODE];
	}

	return { $set: obj, ...objToReturn };
};

export default getOpCodeBasedFieldsForUpdate;
