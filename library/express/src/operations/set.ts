import type { Request } from "express";
import {
	ClientSession,
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

import { INSUFFICIENT_PERMISSIONS } from "../utils/errorConstants";
import findById from "../utils/findById";
import getAppropriateId from "../utils/getAppropriateId";

interface SetOperationArgs {
	collectionName: string;
	db: MongoDBDatabaseInstance;
	id?: string;
	newData?: Record<string, any>;
	req: Request;
	merge: boolean;
	securityRules?: SecurityRules;
	session?: ClientSession;
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
		newData,
		req,
		securityRules,
		merge = false,
		session,
	} = args;
	try {
		if (!newData)
			return {
				error: {
					status: 400,
					message: "New Data is required for creation/update.",
				},
			};
		const collection = db.collection(collectionName);
		const dataToInsert: DataToInsert = {
			...newData,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		let docAlreadyExists: boolean | WithId<Document> | null = false;
		if (id) {
			docAlreadyExists = await findById(collectionName, id, db, session);

			if (docAlreadyExists) {
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
				if (!isAccessAllowed) return { error: INSUFFICIENT_PERMISSIONS() };

				delete dataToInsert._id;
				delete dataToInsert.id;
				const filters = { _id: getAppropriateId(id) };
				let response;
				if (merge) {
					response = await collection.updateOne(
						filters,
						{ $set: dataToInsert },
						{ session }
					);
				} else
					response = await collection.replaceOne(filters, dataToInsert, {
						session,
					});

				if (!response.acknowledged || !response.modifiedCount)
					return {
						error: {
							status: 500,
							message: "Document could not be updated.",
						},
					};
				return { error: null, response, status: 200 };
			}
		}

		dataToInsert._id = id || new ObjectId().toString();
		// Check for security rules before insertion
		const isInsertionAllowed = await isAllowedBySecurityRules(
			{
				req,
				resource: null,
				newResource: unflatten(dataToInsert) as Partial<Object>,
				collection: collectionName,
				id: dataToInsert._id.toString(),
				operation: "create",
			},
			securityRules
		);
		if (!isInsertionAllowed) return { error: INSUFFICIENT_PERMISSIONS() };
		const response = await collection.insertOne(
			{
				...dataToInsert,
				id: dataToInsert._id.toString(),
			} as OptionalId<Document>,
			{ session }
		);
		if (!response.acknowledged)
			return {
				error: {
					status: 500,
					message: "Document could not be created/set.",
				},
			};
		return { error: null, response, status: 201 };
	} catch (error: any) {
		const errorStatus = error instanceof MongoServerError ? 400 : 500;
		return { error: { status: errorStatus, message: error.message } };
	}
};

export default setOperation;
