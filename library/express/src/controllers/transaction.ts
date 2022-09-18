import { Request, Response } from "express";
import { Db, MongoClient } from "mongodb";
import { TranscationMiddlewareBody } from "../types/MiddlewareBody";
import { SecurityRules } from "../types/securityRules";

import deleteOperation from "../operations/delete";
import setOperation from "../operations/set";
import updateOperation from "../operations/update";
import errorResponse from "../utils/error";

interface TransactionControllerArgs {
	operations: TranscationMiddlewareBody[];
	connection: MongoClient;
	db: Db;
	req: Request;
	res: Response;
	securityRules?: SecurityRules;
}

const transaction = async (args: TransactionControllerArgs) => {
	const { operations, connection, req, res, db, securityRules } = args;
	const transactionOptions = {};

	const opsPromises = [];

	if (!operations.length)
		return errorResponse({
			status: 400,
			message: "No operations passed for transaction",
			res,
		});

	const session = connection.startSession();
	session.startTransaction(transactionOptions);

	try {
		for (let operationObject of operations) {
			const { operation } = operationObject;
			if (["delete", "update", "set"].includes(operation)) {
				if (operation === "delete")
					opsPromises.push(
						deleteOperation({
							req,
							db,
							securityRules,
							id: operationObject.id || "",
							session,
							...operationObject,
						})
					);
				if (operation === "update")
					opsPromises.push(
						updateOperation({
							req,
							db,
							securityRules,
							session,
							...operationObject,
						})
					);
				if (operation === "set")
					opsPromises.push(
						setOperation({
							req,
							db,
							securityRules,
							merge: operationObject.merge || false,
							session,
							...operationObject,
						})
					);
			}
		}

		const opResponses = await Promise.all(opsPromises);

		const anyOpFailed = opResponses.find((result) => !!result.error);
		if (anyOpFailed && anyOpFailed.error)
			throw new Error(anyOpFailed.error.message);

		await session.commitTransaction();
		return res
			.status(200)
			.json({ message: "Operations successfully completed." });
	} catch (error: any) {
		session.abortTransaction();
		return errorResponse({
			status: 500,
			message: error.message || "Transaction Failed, please try again later.",
			res,
		});
	} finally {
		await session.endSession();
	}
};

export default transaction;
