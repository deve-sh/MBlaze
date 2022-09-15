import type { Response, Request } from "express";
import { Db as MongoDBDatabaseInstance } from "mongodb";
import isAllowedBySecurityRules from "../securityRules/isAllowedBySecurityRules";
import { SecurityRules } from "../types/securityRules";

import errorResponse from "../utils/error";
import findById from "../utils/findById";

interface GetOperationArgs {
	collectionName: string;
	id?: string;
	db: MongoDBDatabaseInstance;
	res: Response;
	req: Request;
	securityRules?: SecurityRules;
}

const getOperation = async (args: GetOperationArgs) => {
	const { collectionName, id, db, res, req, securityRules } = args;
	if (!id)
		return errorResponse({
			status: 400,
			message: "Document ID Required",
			res,
		});
	const document = await findById(collectionName, id, db);
	const isAccessAllowed = await isAllowedBySecurityRules(
		{
			operation: "get",
			resource: document,
			req,
			id,
			collection: collectionName,
		},
		securityRules
	);
	if (!isAccessAllowed)
		return errorResponse({
			status: 401,
			message: "Insufficient Permissions",
			res,
		});
	if (!document)
		return errorResponse({
			status: 404,
			message: "Document not found",
			res,
		});
	return res.status(200).json({ document });
};

export default getOperation;
