import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { Db, MongoClient } from "mongodb";
import { res } from "./__mocks__/express";

import mongodbRouteHandler from "../src";
import { connect, disconnect } from "./utils/mongodb";

describe("Basic Tests", () => {
	let connection: MongoClient;
	let db: Db;
	let nextFunctionInvoked = false;
	const nextFunction: NextFunction = () => (nextFunctionInvoked = true);

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

	it("should invoke Express' next function in case operation is invalid", async () => {
		await mongodbRouteHandler(db)(
			{
				body: { operation: "unexpected", collectionName: "projects" },
			} as Request,
			res as Response,
			nextFunction
		);
		expect(nextFunctionInvoked).toBe(true);
	});
});
