// Takes a string, and converts it into an ObjectId for MongoDB to read in case it's a valid ObjectId.

import { ObjectId } from "mongodb";

const getAppropriateId = (id: string) => {
	const isObjectId = ObjectId.isValid(id);
	return isObjectId ? new ObjectId(id) : id;
};

export default getAppropriateId;
