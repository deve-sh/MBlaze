import { Db } from "mongodb";
import getAppropriateId from "./getAppropriateId";

const deleteOne = async (collectionName: string, id: string, db: Db) => {
	try {
		const collection = db.collection(collectionName);
		await collection.deleteOne({ _id: getAppropriateId(id) });
		return {};
	} catch (error) {
		return { error };
	}
};

export default deleteOne;
