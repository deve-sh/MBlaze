import type { Response } from "express";
import { Db as MongoDBDatabaseInstance, ObjectId } from "mongodb";
import deleteOne from "../utils/deleteOne";
import errorResponse from "../utils/error";
import findById from "../utils/findById";

interface DeleteOperationArgs {
	collectionName: string;
	id: string;
	db: MongoDBDatabaseInstance;
	res: Response;
}

const deleteOperation = async (args: DeleteOperationArgs) => {
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
	const { error: deletionError } = await deleteOne(collectionName, id, db);
	if (deletionError)
		return errorResponse({
			status: 500,
			message: "Document could not be deleted",
			res,
		});
};

export default deleteOperation;
