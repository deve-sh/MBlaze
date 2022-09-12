import type { NextFunction, Request, Response } from "express";
import { Db as MongoDBDatabaseInstanace, ObjectId } from "mongodb";
import type MiddlewareBody from "./types/MiddlewareBody";

// Operations
import deleteOperation from "./operations/delete";
import getOperation from "./operations/get";
import listOperation from "./operations/list";
import createOperation from "./operations/set";

// Response creators
import errorResponse from "./utils/error";

// Express Middleware
export default async (db: MongoDBDatabaseInstanace) =>
	async (req: Request, res: Response, next: NextFunction): Promise<any> => {
		if (!db)
			throw new Error(
				"MongoDB Database instance has to be passed to MBlaze Middleware"
			);

		const {
			collectionName,
			filters,
			operation,
			id,
			limit = 100,
			offset = 0,
			newData,
			merge,
		} = req.body as MiddlewareBody;

		if (!collectionName)
			return errorResponse({
				status: 400,
				message: "Collection not provided",
				res,
			});
		if (!operation)
			return errorResponse({
				status: 400,
				message: "Operation not provided",
				res,
			});

		if (operation === "get")
			return getOperation({ collectionName, id, db, res });
		if (operation === "list")
			return listOperation({
				collectionName,
				filters: filters || {},
				limit,
				offset,
				db,
				res,
			});
		if (operation === "set")
			return createOperation({
				collectionName,
				id: id || "",
				db,
				res,
				newData: newData || {},
				merge: merge || false,
			});
		if (operation === "delete")
			return deleteOperation({ collectionName, id: id || "", db, res });

		return next();
	};
