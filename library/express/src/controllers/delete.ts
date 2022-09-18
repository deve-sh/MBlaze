import type { Response, Request } from "express";
import type { Db as MongoDBDatabaseInstance } from "mongodb";
import type { SecurityRules } from "../types/securityRules";

import errorResponse from "../utils/error";
import deleteOperation from "../operations/delete";

interface DeleteControllerArgs {
	collectionName: string;
	id: string;
	db: MongoDBDatabaseInstance;
	res: Response;
	req: Request;
	securityRules?: SecurityRules;
}

const deleteController = async (args: DeleteControllerArgs) => {
	const { res } = args;
	const { error } = await deleteOperation(args);
	if (error) return errorResponse({ ...error, res });
	return res.sendStatus(204);
};

export default deleteController;
