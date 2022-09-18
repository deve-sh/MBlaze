import type { Request } from "express";
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
	req: Request;
	securityRules?: SecurityRules;
}

const getOperation = async (args: GetOperationArgs) => {
	const { collectionName, id, db, req, securityRules } = args;
	if (!id) return { error: DOCUMENT_ID_REQUIRED() };
	const document = await findById(collectionName, id, db);
	const isGetOpAllowed = await isAllowedBySecurityRules(
		{
			operation: "get",
			resource: document,
			req,
			id,
			collection: collectionName,
		},
		securityRules
	);
	if (!isGetOpAllowed) return { error: INSUFFICIENT_PERMISSIONS() };
	if (!document) return { error: DOCUMENT_NOT_FOUND() };
	return { error: null, document };
};

export default getOperation;
