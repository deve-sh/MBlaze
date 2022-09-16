import type { Request, Response } from "express";
import {
	Db as MongoDBDatabaseInstance,
	MongoServerError,
	ObjectId,
} from "mongodb";
import deepMerge from "deepmerge";
import { unflatten } from "flat";

import type { SecurityRules } from "../types/securityRules";
import isAllowedBySecurityRules from "../securityRules/isAllowedBySecurityRules";

import errorResponse from "../utils/error";
import {
	DOCUMENT_NOT_FOUND,
	INSUFFICIENT_PERMISSIONS,
} from "../utils/errorConstants";
import findById from "../utils/findById";

interface UpdateOperationArgs {
	collectionName: string;
	db: MongoDBDatabaseInstance;
	id?: string;
	newData?: Record<string, any>;
	res: Response;
	req: Request;
	securityRules?: SecurityRules;
}

interface DataToUpdate extends Record<string, any> {
	updatedAt?: Date;
}

const updateOperation = async (args: UpdateOperationArgs) => {
	const { collectionName, db, id, res, newData, securityRules, req } = args;
	try {
		if (!newData)
			return errorResponse({
				status: 400,
				message: "New Data is required for updation.",
				res,
			});

		const collection = db.collection(collectionName);
		const dataToUpdate: DataToUpdate = {
			...newData,
			updatedAt: new Date(),
		};

		let docExists: any = false;
		if (!id)
			return errorResponse({
				status: 400,
				message: "Document ID is required for update operation.",
				res,
			});

		docExists = await findById(collectionName, id, db);

		if (docExists) {
			// Check for access to update
			const dataPostUpdate = deepMerge(
				docExists,
				unflatten(dataToUpdate) as Partial<Object>
			);
			const isUpdationAllowed = await isAllowedBySecurityRules(
				{
					req,
					operation: "update",
					resource: docExists,
					newResource: dataPostUpdate,
					id,
					collection: collectionName,
				},
				securityRules
			);
			if (!isUpdationAllowed) return INSUFFICIENT_PERMISSIONS(res);

			const isObjectId = ObjectId.isValid(id);

			const response = await collection.updateOne(
				isObjectId ? { _id: new ObjectId(id) } : { _id: id },
				{ $set: dataToUpdate }
			);
			if (!response.acknowledged || !response.modifiedCount)
				return errorResponse({
					status: 500,
					message: "Document could not be updated.",
					res,
				});
			return res.status(200).json(response);
		} else return DOCUMENT_NOT_FOUND(res);
	} catch (error: any) {
		const errorStatus = error instanceof MongoServerError ? 400 : 500;
		return errorResponse({ status: errorStatus, message: error.message, res });
	}
};

export default updateOperation;
