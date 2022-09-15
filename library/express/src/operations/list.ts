import type { Response, Request } from "express";
import type { Db as MongoDBDatabaseInstance } from "mongodb";
import type { SecurityRules } from "../types/securityRules";

import isAllowedBySecurityRules from "../securityRules/isAllowedBySecurityRules";
import errorResponse from "../utils/error";

interface ListOperationArgs {
	collectionName: string;
	filters: Record<string, any>;
	db: MongoDBDatabaseInstance;
	limit: number;
	offset: number;
	res: Response;
	req: Request;
	securityRules?: SecurityRules;
}

const listOperation = async (args: ListOperationArgs) => {
	const {
		collectionName,
		filters,
		db,
		res,
		req,
		limit = 100,
		offset = 0,
		securityRules,
	} = args;
	try {
		const isAccessAllowed = await isAllowedBySecurityRules(
			{
				req,
				filters,
				collection: collectionName,
				operation: "list",
			},
			securityRules
		);
		if (!isAccessAllowed)
			return errorResponse({
				status: 401,
				message: "Insufficient Permissions",
				res,
			});
		const collection = db.collection(collectionName);
		const documents = await collection
			.find(filters || {})
			.limit(limit)
			.skip(offset)
			.toArray();
		return res.status(200).json({ documents });
	} catch (err: any) {
		return errorResponse({ status: 500, message: err.message, res });
	}
};

export default listOperation;
