import type { Response } from "express";
import {
	Db as MongoDBDatabaseInstance,
	Document,
	MongoServerError,
	ObjectId,
	OptionalId,
} from "mongodb";

import errorResponse from "../utils/error";
import findById from "../utils/findById";

interface SetOperationArgs {
	collectionName: string;
	db: MongoDBDatabaseInstance;
	id?: string;
	newData: Record<string, any>;
	res: Response;
	merge: boolean;
}

interface DataToInsert extends Record<string, any> {
	_id?: string;
	updatedAt?: Date;
	createdAt?: Date;
}

const setOperation = async (args: SetOperationArgs) => {
	const { collectionName, db, id, res, newData, merge = false } = args;
	try {
		const collection = db.collection(collectionName);
		const dataToInsert: DataToInsert = {
			...newData,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		let docAlreadyExists = false;
		if (id) {
			dataToInsert._id = id;
			docAlreadyExists = !!(await findById(collectionName, id, db));

			if (docAlreadyExists) {
				const isObjectId = ObjectId.isValid(id);
				delete dataToInsert.createdAt;

				const filters = isObjectId ? { _id: new ObjectId(id) } : { _id: id };
				let response;
				if (merge) {
					response = await collection.updateOne(filters, {
						$set: dataToInsert,
					});
				} else response = await collection.replaceOne(filters, dataToInsert);

				if (!response.acknowledged || !response.modifiedCount)
					return errorResponse({
						status: 500,
						message: "Document could not be updated.",
						res,
					});
				return res.status(200).json(response);
			}
		}

		const response = await collection.insertOne(
			dataToInsert as OptionalId<Document>
		);
		if (!response.acknowledged || !response.insertedId)
			return errorResponse({
				status: 500,
				message: "Document could not be created/set.",
				res,
			});
		return res.status(201).json(response);
	} catch (error: any) {
		const errorStatus = error instanceof MongoServerError ? 400 : 500;
		return errorResponse({ status: errorStatus, message: error.message, res });
	}
};

export default setOperation;
