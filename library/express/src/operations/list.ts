import type { Request } from "express";
import type { Db as MongoDBDatabaseInstance } from "mongodb";
import type { SecurityRules } from "../types/securityRules";

import isAllowedBySecurityRules from "../securityRules/isAllowedBySecurityRules";
import { INSUFFICIENT_PERMISSIONS } from "../utils/errorConstants";

interface ListOperationArgs {
	collectionName: string;
	filters: Record<string, any>;
	db: MongoDBDatabaseInstance;
	limit: number;
	offset: number;
	req: Request;
	securityRules?: SecurityRules;
}

const listOperation = async (args: ListOperationArgs) => {
	const {
		collectionName,
		filters,
		db,
		req,
		limit = 100,
		offset = 0,
		securityRules,
	} = args;
	try {
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
		const documents = await collection
			.find(filters || {})
			.limit(limit)
			.skip(offset)
			.toArray();
		return { error: null, documents };
	} catch (err: any) {
		return { error: { status: 500, message: err.message } };
	}
};

export default listOperation;
