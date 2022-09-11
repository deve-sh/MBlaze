import type { NextFunction, Request, Response } from "express";
import type { Db as MongoDBDatabaseInstanace } from "mongodb";
import type MiddlewareBody from "./types/MiddlewareBody";

// Express Middleware
export default async (db: MongoDBDatabaseInstanace) =>
	async (req: Request, res: Response, next: NextFunction): Promise<any> => {
		if (!db)
			throw new Error(
				"MongoDB Database instance has to be passed to MBlaze Middleware"
			);

		const { collection, filters, operation } = req.body as MiddlewareBody;

		return next();
	};
