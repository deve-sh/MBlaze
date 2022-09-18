import type { Request } from "express";
import {
	Db as MongoDBDatabaseInstance,
	MongoServerError,
	ObjectId,
	UpdateResult,
} from "mongodb";
import deepMerge from "deepmerge";
import { unflatten } from "flat";

import type { SecurityRules } from "../types/securityRules";
import isAllowedBySecurityRules from "../securityRules/isAllowedBySecurityRules";

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
	req: Request;
	securityRules?: SecurityRules;
}

interface DataToUpdate extends Record<string, any> {
	updatedAt?: Date;
}

const updateOperation = async (args: UpdateOperationArgs) => {
	const { collectionName, db, id, newData, securityRules, req } = args;
	try {
		if (!newData)
			return {
				error: {
					status: 400,
					message: "New Data is required for updation.",
				},
			};

		const collection = db.collection(collectionName);
		const dataToUpdate: DataToUpdate = {
			...newData,
			updatedAt: new Date(),
		};

		let docExists: any = false;
		if (!id)
			return {
				error: {
					status: 400,
					message: "Document ID is required for update operation.",
				},
			};

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
			if (!isUpdationAllowed) return { error: INSUFFICIENT_PERMISSIONS() };

			const isObjectId = ObjectId.isValid(id);

			const response = await collection.updateOne(
				isObjectId ? { _id: new ObjectId(id) } : { _id: id },
				{ $set: dataToUpdate }
			);
			if (!response.acknowledged || !response.modifiedCount)
				return {
					error: {
						status: 500,
						message: "Document could not be updated.",
					},
				};
			return { error: null, response };
		} else return { error: DOCUMENT_NOT_FOUND() };
	} catch (error: any) {
		const errorStatus = error instanceof MongoServerError ? 400 : 500;
		return { error: { status: errorStatus, message: error.message } };
	}
};

export default updateOperation;
