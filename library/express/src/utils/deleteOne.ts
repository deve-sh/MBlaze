import { Db, ObjectId } from "mongodb";

const deleteOne = async (collectionName: string, id: string, db: Db) => {
	try {
		const collection = db.collection(collectionName);
		const isObjectId = ObjectId.isValid(id);
		await collection.deleteOne(
			isObjectId ? { _id: new ObjectId(id) } : { _id: id }
		);
		return {};
	} catch (error) {
		return { error };
	}
};

export default deleteOne;
