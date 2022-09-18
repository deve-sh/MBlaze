import type { Request, Response } from "express";
import { Db as MongoDBDatabaseInstance } from "mongodb";

import type { SecurityRules } from "../types/securityRules";

import errorResponse from "../utils/error";
import updateOperation from "../operations/update";

interface UpdateControllerArgs {
	collectionName: string;
	db: MongoDBDatabaseInstance;
	id?: string;
	newData?: Record<string, any>;
	res: Response;
	req: Request;
	securityRules?: SecurityRules;
}

const update = async (args: UpdateControllerArgs) => {
	const { res } = args;

	const { error, response } = await updateOperation(args);

	if (error) return errorResponse({ ...error, res });
	return res.status(200).json(response);
};

export default update;
