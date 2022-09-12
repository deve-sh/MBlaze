import type { Response } from "express";
import { Db as MongoDBDatabaseInstance } from "mongodb";

import errorResponse from "../utils/error";

interface ListOperationArgs {
	collectionName: string;
	filters: Record<string, any>;
	db: MongoDBDatabaseInstance;
	limit: number;
	offset: number;
	res: Response;
}

const listOperation = async (args: ListOperationArgs) => {
	const { collectionName, filters, db, res, limit = 100, offset = 0 } = args;
	try {
		const collection = db.collection(collectionName);
		const documents = await collection
			.find(filters || {})
			.limit(limit)
			.skip(offset)
			.toArray();
		return res.status(200).json({ documents });
	} catch (err: any) {
		return errorResponse({ status: 500, message: err.message, res });
	}
};

export default listOperation;
