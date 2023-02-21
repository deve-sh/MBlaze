import isAllowedBySecurityRules from "../securityRules/isAllowedBySecurityRules";
import { INSUFFICIENT_PERMISSIONS } from "../utils/errorConstants";
import { type ListOperationArgs } from "./list";

const countOperation = async (args: ListOperationArgs) => {
	try {
		const { collectionName, filters, db, req, securityRules } = args;
		const isListOpAllowed = await isAllowedBySecurityRules(
			{
				req,
				filters,
				collection: collectionName,
				operation: "list",
			},
			securityRules
		);
		if (!isListOpAllowed) return { error: INSUFFICIENT_PERMISSIONS() };
		const collection = db.collection(collectionName);
		let collectionFetchRef = collection.countDocuments(filters || {});
		const nDocuments = await collectionFetchRef;
		return { error: null, count: nDocuments };
	} catch (err: any) {
		return { error: { status: 500, message: err.message } };
	}
};

export default countOperation;
