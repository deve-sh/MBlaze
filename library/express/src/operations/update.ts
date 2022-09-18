import type { Request } from "express";
import { ClientSession, Db, MongoServerError } from "mongodb";
import deepMerge from "deepmerge";
import { unflatten } from "flat";

import type { SecurityRules } from "../types/securityRules";
import isAllowedBySecurityRules from "../securityRules/isAllowedBySecurityRules";

import {
	DOCUMENT_NOT_FOUND,
	INSUFFICIENT_PERMISSIONS,
} from "../utils/errorConstants";
import findById from "../utils/findById";
import getAppropriateId from "../utils/getAppropriateId";

interface UpdateOperationArgs {
	collectionName: string;
	db: Db;
	id?: string;
	newData?: Record<string, any>;
	req: Request;
	securityRules?: SecurityRules;
	session?: ClientSession;
}

interface DataToUpdate extends Record<string, any> {
	updatedAt?: Date;
}

const updateOperation = async (args: UpdateOperationArgs) => {
	const { collectionName, db, id, newData, securityRules, req, session } = args;
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

		docExists = await findById(collectionName, id, db, session);

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

			delete dataToUpdate.id;
			delete dataToUpdate._id;

			const response = await collection.updateOne(
				{ _id: getAppropriateId(id) },
				{ $set: dataToUpdate },
				{ session }
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
