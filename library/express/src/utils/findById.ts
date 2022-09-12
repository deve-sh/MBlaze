import { Db, ObjectId } from "mongodb";

const findById = async (collectionName: string, id: string, db: Db) => {
	const collection = db.collection(collectionName);
	const isObjectId = ObjectId.isValid(id);
	const document = await collection.findOne(
		isObjectId ? { _id: new ObjectId(id) } : { _id: id }
	);
	return document;
};

export default findById;
