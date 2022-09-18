import { ClientSession, Db } from "mongodb";
import getAppropriateId from "./getAppropriateId";

const findById = async (
	collectionName: string,
	id: string,
	db: Db,
	session?: ClientSession
) => {
	const collection = db.collection(collectionName);
	const document = await collection.findOne(
		{ _id: getAppropriateId(id) },
		{ session }
	);
	return document;
};

export default findById;
