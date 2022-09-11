import type { NextFunction, Request, Response } from "express";
import type { Db as MongoDBDatabaseInstanace } from "mongodb";
import type MiddlewareBody from "./types/MiddlewareBody";

import errorResponse from "./utils/error";

// Express Middleware
export default async (db: MongoDBDatabaseInstanace) =>
	async (req: Request, res: Response, next: NextFunction): Promise<any> => {
		if (!db)
			throw new Error(
				"MongoDB Database instance has to be passed to MBlaze Middleware"
			);

		const { collection, filters, operation } = req.body as MiddlewareBody;

		if (!collection)
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

		return next();
	};
