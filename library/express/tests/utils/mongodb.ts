import { Db, MongoClient } from "mongodb";

export const connect = async () => {
	global.connection = await MongoClient.connect(globalThis.__MONGO_URI__);
	global.db = global.connection.db(globalThis.__MONGO_DB_NAME__) as Db;
	return { connection: global.connection, db: global.db };
};

export const disconnect = async () => {
	await global.connection.close();
};
