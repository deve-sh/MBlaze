import type { Request, Response } from "express";
import { Db as MongoDBDatabaseInstance } from "mongodb";

import type { SecurityRules } from "../types/securityRules";

import errorResponse from "../utils/error";
import setOperation from "../operations/set";

interface SetControllerArgs {
	collectionName: string;
	db: MongoDBDatabaseInstance;
	id?: string;
	newData?: Record<string, any>;
	res: Response;
	req: Request;
	merge: boolean;
	securityRules?: SecurityRules;
}

const set = async (args: SetControllerArgs) => {
	const { res } = args;
	const { error, response, status = 201 } = await setOperation(args);

	if (error) return errorResponse({ ...error, res });
	return res.status(status).json(response);
};

export default set;
