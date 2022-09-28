import DB from "./classes/DB";
export default DB;

// Reserved op types/field types
import arrayUnion from "./reservedFieldTypes/arrayUnion";
import arrayRemove from "./reservedFieldTypes/arrayRemove";
import serverTimestamp from "./reservedFieldTypes/serverTimestamp";
import increment from "./reservedFieldTypes/increment";
import fieldDelete from "./reservedFieldTypes/delete";

export const FieldValue = {
	arrayUnion,
	arrayRemove,
	increment,
	serverTimestamp,
	delete: fieldDelete,
};
