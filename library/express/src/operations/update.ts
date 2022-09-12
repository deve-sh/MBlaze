import type { Response } from "express";
import {
	Db as MongoDBDatabaseInstance,
	MongoServerError,
	ObjectId,
} from "mongodb";

import errorResponse from "../utils/error";
import findById from "../utils/findById";

interface UpdateOperationArgs {
	collectionName: string;
	db: MongoDBDatabaseInstance;
	id?: string;
	newData: Record<string, any>;
	res: Response;
}

interface DataToUpdate extends Record<string, any> {
	updatedAt?: Date;
}

const updateOperation = async (args: UpdateOperationArgs) => {
	const { collectionName, db, id, res, newData } = args;
	try {
		const collection = db.collection(collectionName);
		const dataToUpdate: DataToUpdate = {
			...newData,
			updatedAt: new Date(),
		};

		let docExists: any = false;
		if (!id)
			return errorResponse({
				status: 400,
				message: "Document ID is required for update operation.",
				res,
			});

		dataToUpdate._id = id;
		docExists = await findById(collectionName, id, db);

		if (docExists) {
			const isObjectId = ObjectId.isValid(id);

			const response = await collection.updateOne(
				isObjectId ? { _id: new ObjectId(id) } : { _id: id },
				{ $set: dataToUpdate }
			);
			if (!response.acknowledged || !response.upsertedId)
				return errorResponse({
					status: 500,
					message: "Document could not be updated.",
					res,
				});
			return res.status(200).json(response);
		} else
			return errorResponse({
				status: 404,
				message: "Document not found.",
				res,
			});
	} catch (error: any) {
		const errorStatus = error instanceof MongoServerError ? 400 : 500;
		return errorResponse({ status: errorStatus, message: error.message, res });
	}
};

export default updateOperation;
