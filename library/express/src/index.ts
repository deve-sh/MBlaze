import type { NextFunction, Request, Response } from "express";
import { Db as MongoDBDatabaseInstanace, ObjectId } from "mongodb";
import getOperation from "./operations/get";
import type MiddlewareBody from "./types/MiddlewareBody";

import errorResponse from "./utils/error";

// Express Middleware
export default async (db: MongoDBDatabaseInstanace) =>
	async (req: Request, res: Response, next: NextFunction): Promise<any> => {
		if (!db)
			throw new Error(
				"MongoDB Database instance has to be passed to MBlaze Middleware"
			);

		const { collectionName, filters, operation, id } =
			req.body as MiddlewareBody;

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

		return next();
	};
