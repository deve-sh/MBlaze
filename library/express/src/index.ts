import type { NextFunction, Request, Response } from "express";
import { Db as MongoDBDatabaseInstanace } from "mongodb";
import type MiddlewareBody from "./types/MiddlewareBody";

// Operations
import deleteOperation from "./operations/delete";
import getOperation from "./operations/get";
import listOperation from "./operations/list";
import setOperation from "./operations/set";
import updateOperation from "./operations/update";

// Response creators
import errorResponse from "./utils/error";

// Express Middleware
const mongodbRouteHandler = (db: MongoDBDatabaseInstanace) => {
	if (!db)
		throw new Error(
			"MongoDB Database connection instance has to be passed to MBlaze Middleware"
		);

	return async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> => {
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
			return getOperation({ collectionName, id, db, res, req });
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
			return setOperation({
				collectionName,
				id: id || "",
				db,
				res,
				newData: newData,
				merge: merge || false,
			});
		if (operation === "update")
			return updateOperation({
				collectionName,
				id: id || "",
				db,
				res,
				newData: newData,
			});
		if (operation === "delete")
			return deleteOperation({ collectionName, id: id || "", db, res });

		return next();
	};
};

export default mongodbRouteHandler;
