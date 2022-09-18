import { Db } from "mongodb";
import getAppropriateId from "./getAppropriateId";

const findById = async (collectionName: string, id: string, db: Db) => {
	const collection = db.collection(collectionName);
	const document = await collection.findOne({ _id: getAppropriateId(id) });
	return document;
};

export default findById;
