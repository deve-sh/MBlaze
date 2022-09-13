import { Db } from "mongodb";
import mongodbRouteHandler from "../src";
const { MongoClient } = require("mongodb");

describe("Basic Tests", () => {
	let connection;
	let db: Db;

	beforeAll(async () => {
		connection = await MongoClient.connect(globalThis.__MONGO_URI__);
		db = await connection.db(globalThis.__MONGO_DB_NAME__);
	});

	afterAll(async () => {
		await connection.close();
	});

	it("should be a function", () => {
		expect(mongodbRouteHandler).toBeInstanceOf(Function);
	});

	it("should throw an error if db instance is not passed", () => {
		// To verify for non-typescript projects
		expect(mongodbRouteHandler).toThrow(
			"MongoDB Database connection instance has to be passed"
		);
	});

	it("should return async route handler function", () => {
		expect(mongodbRouteHandler(db)).toBeInstanceOf(Function);
		expect(mongodbRouteHandler(db).constructor.name).toBe("AsyncFunction");
	});
});
