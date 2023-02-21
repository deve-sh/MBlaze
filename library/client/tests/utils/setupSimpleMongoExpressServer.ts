const express = require("express");
import mongodbRouteHandler from "mblaze.express";
import { MongoClient } from "mongodb";

const setupSimpleMongoExpressServer = () =>
	new Promise(async (resolve) => {
		const app = express();
		const PORT = 8080;

		const mongoClient = await new MongoClient(
			globalThis.__MONGO_URI__
		).connect();
		const db = mongoClient.db(globalThis.__MONGO_DB_NAME__);
		app.use(express.json());
		app.use("/mongodb", mongodbRouteHandler(db));
		const server = app.listen(PORT, () =>
			resolve(async () => {
				// Cleanup functions for post test complettion
				await Promise.all([server.close(), mongoClient.close()]);
			})
		);
	});

export default setupSimpleMongoExpressServer;
