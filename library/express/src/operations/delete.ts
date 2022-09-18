import type { Request } from "express";
import type { ClientSession, Db as MongoDBDatabaseInstance } from "mongodb";
import type { SecurityRules } from "../types/securityRules";

import isAllowedBySecurityRules from "../securityRules/isAllowedBySecurityRules";
import deleteOne from "../utils/deleteOne";
import findById from "../utils/findById";
import {
	DOCUMENT_NOT_FOUND,
	INSUFFICIENT_PERMISSIONS,
} from "../utils/errorConstants";

interface DeleteOperationArgs {
	collectionName: string;
	id: string;
	db: MongoDBDatabaseInstance;
	req: Request;
	securityRules?: SecurityRules;
	session?: ClientSession;
}

const deleteOperation = async (args: DeleteOperationArgs) => {
	const { collectionName, id, db, req, securityRules, session } = args;
	if (!id)
		return {
			error: {
				status: 400,
				message: "Document ID Required",
			},
		};

	const document = await findById(collectionName, id, db, session);
	const isDeletionAllowed = await isAllowedBySecurityRules(
		{
			req,
			collection: collectionName,
			id,
			resource: document,
			operation: "delete",
		},
		securityRules
	);
	if (!isDeletionAllowed) return { error: INSUFFICIENT_PERMISSIONS() };
	if (!document) return { error: DOCUMENT_NOT_FOUND() };
	const { error: deletionError } = await deleteOne(
		collectionName,
		id,
		db,
		session
	);
	if (deletionError)
		return {
			error: {
				status: 500,
				message: "Document could not be deleted",
			},
		};
	return { error: null, response: null };
};

export default deleteOperation;
