import type { Response } from "express";
import { Db as MongoDBDatabaseInstance, ObjectId } from "mongodb";

import errorResponse from "../utils/error";
import findById from "../utils/findById";

interface GetOperationArgs {
	collectionName: string;
	id?: string;
	db: MongoDBDatabaseInstance;
	res: Response;
}

const getOperation = async (args: GetOperationArgs) => {
	const { collectionName, id, db, res } = args;
	if (!id)
		return errorResponse({
			status: 400,
			message: "Document ID Required",
			res,
		});
	const document = await findById(collectionName, id, db);
	if (!document)
		return errorResponse({
			status: 404,
			message: "Document not found",
			res,
		});
	return res.status(200).json({ document });
};

export default getOperation;
