import { ClientSession, Db } from "mongodb";
import getAppropriateId from "./getAppropriateId";

const deleteOne = async (
	collectionName: string,
	id: string,
	db: Db,
	session?: ClientSession
) => {
	try {
		const collection = db.collection(collectionName);
		await collection.deleteOne({ _id: getAppropriateId(id) }, { session });
		return {};
	} catch (error) {
		return { error };
	}
};

export default deleteOne;
