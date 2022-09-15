import type { Response, Request } from "express";
import type { Db as MongoDBDatabaseInstance } from "mongodb";
import type { SecurityRules } from "../types/securityRules";

import isAllowedBySecurityRules from "../securityRules/isAllowedBySecurityRules";
import deleteOne from "../utils/deleteOne";
import errorResponse from "../utils/error";
import findById from "../utils/findById";

interface DeleteOperationArgs {
	collectionName: string;
	id: string;
	db: MongoDBDatabaseInstance;
	res: Response;
	req: Request;
	securityRules?: SecurityRules;
}

const deleteOperation = async (args: DeleteOperationArgs) => {
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
			req,
			collection: collectionName,
			id,
			resource: document,
			operation: "delete",
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
	const { error: deletionError } = await deleteOne(collectionName, id, db);
	if (deletionError)
		return errorResponse({
			status: 500,
			message: "Document could not be deleted",
			res,
		});
	return res.sendStatus(204);
};

export default deleteOperation;
