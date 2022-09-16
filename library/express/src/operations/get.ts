import type { Response, Request } from "express";
import { Db as MongoDBDatabaseInstance } from "mongodb";
import isAllowedBySecurityRules from "../securityRules/isAllowedBySecurityRules";
import { SecurityRules } from "../types/securityRules";

import {
	DOCUMENT_ID_REQUIRED,
	DOCUMENT_NOT_FOUND,
	INSUFFICIENT_PERMISSIONS,
} from "../utils/errorConstants";
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
	if (!id) return DOCUMENT_ID_REQUIRED(res);
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
	if (!isAccessAllowed) return INSUFFICIENT_PERMISSIONS(res);
	if (!document) return DOCUMENT_NOT_FOUND(res);
	return res.status(200).json({ document });
};

export default getOperation;
