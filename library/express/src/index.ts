import type { NextFunction, Request, Response } from "express";
import { Db as MongoDBDatabaseInstanace } from "mongodb";
import type MiddlewareBody from "./types/MiddlewareBody";

import type { SecurityRules } from "./types/securityRules";

// Operations
import get from "./controllers/get";
import list from "./controllers/list";
import deleteController from "./controllers/delete";
import update from "./controllers/update";
import set from "./controllers/set";

// Response creators
import errorResponse from "./utils/error";

// Express Middleware
const mongodbRouteHandler = (
	db: MongoDBDatabaseInstanace,
	securityRules?: SecurityRules
) => {
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
			sortBy,
			sortOrder = "asc",
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
			return get({ collectionName, id, db, res, req, securityRules });
		if (operation === "list")
			return list({
				collectionName,
				filters: filters || {},
				limit,
				offset,
				db,
				res,
				req,
				securityRules,
				sortBy,
				sortOrder,
			});
		if (operation === "set")
			return set({
				collectionName,
				id: id || "",
				db,
				res,
				newData: newData,
				merge: merge || false,
				req,
				securityRules,
			});
		if (operation === "update")
			return update({
				collectionName,
				id: id || "",
				db,
				res,
				newData: newData,
				securityRules,
				req,
			});
		if (operation === "delete")
			return deleteController({
				collectionName,
				id: id || "",
				db,
				res,
				req,
				securityRules,
			});

		return next();
	};
};

export default mongodbRouteHandler;
