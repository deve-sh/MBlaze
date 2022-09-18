import type { Response, Request } from "express";
import { Db as MongoDBDatabaseInstance } from "mongodb";
import getOperation from "../operations/get";
import { SecurityRules } from "../types/securityRules";
import errorResponse from "../utils/error";

interface GetControllerArgs {
	collectionName: string;
	id?: string;
	db: MongoDBDatabaseInstance;
	res: Response;
	req: Request;
	securityRules?: SecurityRules;
}

const get = async (args: GetControllerArgs) => {
	const { res } = args;
	const { error, document } = await getOperation(args);
	if (error) return errorResponse({ ...error, res });
	return res.status(200).json({ document });
};

export default get;
