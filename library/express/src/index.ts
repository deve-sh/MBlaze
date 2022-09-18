import type { NextFunction, Request, Response } from "express";
import type { Db as MongoDBDatabaseInstanace, MongoClient } from "mongodb";

import type {
	RegularMiddlewareBody,
	TranscationMiddlewareBody,
} from "./types/MiddlewareBody";
import type { SecurityRules } from "./types/securityRules";

// Op Controllers
import transaction from "./controllers/transaction";
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
	securityRules?: SecurityRules,
	connection?: MongoClient
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
		if (Array.isArray(req.body)) {
			if (!connection)
				return errorResponse({
					status: 400,
					message:
						"Transaction support hasn\t been turned on. Please pass DB Connection arg to enable it.",
					res,
				});

			return transaction({
				operations: req.body as TranscationMiddlewareBody[],
				connection,
				db,
				req,
				res,
				securityRules,
			});
		}

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
		} = req.body as RegularMiddlewareBody;

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
