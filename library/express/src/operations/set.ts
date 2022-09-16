import type { Request, Response } from "express";
import {
	Db as MongoDBDatabaseInstance,
	Document,
	MongoServerError,
	ObjectId,
	OptionalId,
	WithId,
} from "mongodb";
import deepMerge from "deepmerge";
import { unflatten } from "flat";

import type { SecurityRules } from "../types/securityRules";
import isAllowedBySecurityRules from "../securityRules/isAllowedBySecurityRules";

import errorResponse from "../utils/error";
import { INSUFFICIENT_PERMISSIONS } from "../utils/errorConstants";
import findById from "../utils/findById";

interface SetOperationArgs {
	collectionName: string;
	db: MongoDBDatabaseInstance;
	id?: string;
	newData?: Record<string, any>;
	res: Response;
	req: Request;
	merge: boolean;
	securityRules?: SecurityRules;
}

interface DataToInsert extends Record<string, any> {
	_id?: string;
	updatedAt?: Date;
	createdAt?: Date;
}

const setOperation = async (args: SetOperationArgs) => {
	const {
		collectionName,
		db,
		id,
		res,
		newData,
		req,
		securityRules,
		merge = false,
	} = args;
	try {
		if (!newData)
			return errorResponse({
				status: 400,
				message: "New Data is required for creation/update.",
				res,
			});
		const collection = db.collection(collectionName);
		const dataToInsert: DataToInsert = {
			...newData,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		let docAlreadyExists: boolean | WithId<Document> | null = false;
		if (id) {
			docAlreadyExists = await findById(collectionName, id, db);

			if (docAlreadyExists) {
				const isObjectId = ObjectId.isValid(id);
				dataToInsert.createdAt = docAlreadyExists.createdAt;

				// Security Rules
				const dataPostUpdate = deepMerge(
					docAlreadyExists,
					unflatten(dataToInsert) as Partial<Object>
				);
				const isAccessAllowed = await isAllowedBySecurityRules(
					{
						req,
						operation: "update",
						resource: docAlreadyExists,
						newResource: !merge ? dataPostUpdate : dataToInsert,
						id,
						collection: collectionName,
					},
					securityRules
				);
				if (!isAccessAllowed) return INSUFFICIENT_PERMISSIONS(res);

				const filters = isObjectId ? { _id: new ObjectId(id) } : { _id: id };
				let response;
				if (merge) {
					response = await collection.updateOne(filters, {
						$set: dataToInsert,
					});
				} else response = await collection.replaceOne(filters, dataToInsert);

				if (!response.acknowledged || !response.modifiedCount)
					return errorResponse({
						status: 500,
						message: "Document could not be updated.",
						res,
					});
				return res.status(200).json(response);
			}
		}

		// Check for security rules before insertion
		dataToInsert._id = id || new ObjectId().toString();
		const isInsertionAllowed = await isAllowedBySecurityRules(
			{
				req,
				resource: null,
				newResource: unflatten(dataToInsert) as Partial<Object>,
				collection: collectionName,
				id: dataToInsert._id,
				operation: "create",
			},
			securityRules
		);
		if (!isInsertionAllowed) return INSUFFICIENT_PERMISSIONS(res);
		const response = await collection.insertOne(
			dataToInsert as OptionalId<Document>
		);
		if (!response.acknowledged)
			return errorResponse({
				status: 500,
				message: "Document could not be created/set.",
				res,
			});
		return res.status(201).json(response);
	} catch (error: any) {
		const errorStatus = error instanceof MongoServerError ? 400 : 500;
		return errorResponse({ status: errorStatus, message: error.message, res });
	}
};

export default setOperation;
