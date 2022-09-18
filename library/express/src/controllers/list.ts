import type { Response, Request } from "express";
import type { Db as MongoDBDatabaseInstance } from "mongodb";
import type { SecurityRules } from "../types/securityRules";
import type sortOrder from "../types/sortOrder";

import errorResponse from "../utils/error";
import listOperation from "../operations/list";

interface ListControllerArgs {
	collectionName: string;
	filters: Record<string, any>;
	db: MongoDBDatabaseInstance;
	limit: number;
	offset: number;
	res: Response;
	req: Request;
	securityRules?: SecurityRules;
	sortBy?: string;
	sortOrder: sortOrder;
}

const list = async (args: ListControllerArgs) => {
	const { res } = args;
	const { error, documents } = await listOperation(args);

	if (error) return errorResponse({ ...error, res });
	return res.status(200).json({ documents });
};

export default list;
