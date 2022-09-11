import type { Response } from "express";
import { Db as MongoDBDatabaseInstance, ObjectId } from "mongodb";

import errorResponse from "../utils/error";

const getOperation = async ({
	collectionName,
	id,
	db,
	res,
}: {
	collectionName: string;
	id?: string;
	db: MongoDBDatabaseInstance;
	res: Response;
}) => {
	if (!id)
		return errorResponse({
			status: 400,
			message: "Document ID Required",
			res,
		});
	const collection = db.collection(collectionName);
	const document = await collection.findOne({
		$or: [{ _id: id }, { _id: new ObjectId(id) }],
	});
	if (!document)
		return errorResponse({
			status: 404,
			message: "Document not found",
			res,
		});
	return res.status(200).json({ document });
};

export default getOperation;
