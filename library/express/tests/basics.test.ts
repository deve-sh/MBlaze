import { Db, MongoClient } from "mongodb";
import mongodbRouteHandler from "../src";
import { connect, disconnect } from "./utils/mongodb";

describe("Basic Tests", () => {
	let connection: MongoClient;
	let db: Db;

	beforeAll(async () => {
		await connect().then((vals) => {
			connection = vals.connection;
			db = vals.db;
		});
	});

	afterAll(disconnect);

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
