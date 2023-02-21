import type { Response, Request } from "express";
import type { Db as MongoDBDatabaseInstance } from "mongodb";
import type { SecurityRules } from "../types/securityRules";
import type sortOrder from "../types/sortOrder";

import errorResponse from "../utils/error";
import countOperation from "../operations/count";

interface CountControllerArgs {
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

const count = async (args: CountControllerArgs) => {
	const { res } = args;
	const { error, count } = await countOperation(args);

	if (error) return errorResponse({ ...error, res });
	return res.status(200).json({ count });
};

export default count;
