import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { Db, MongoClient } from "mongodb";
import { generateRequest, res } from "./__mocks__/express";

import mongodbRouteHandler from "../src";
import { connect, disconnect } from "./utils/mongodb";

describe("Transaction (ACID) Related Tests", () => {
	let connection: MongoClient;
	let db: Db;
	const next: NextFunction = () => null;

	beforeAll(async () => {
		await connect().then((vals) => {
			connection = vals.connection;
			db = vals.db;
		});
	});

	afterAll(disconnect);

	it("should return an error response if connection instance is not passed", async () => {
		const routeHandlerWithoutConnectionInstance = mongodbRouteHandler(db);
		const req = generateRequest([
			{
				collectionName: "projects",
				id: "project",
				operation: "set",
				newData: { a: 1 },
			},
		]);
		const responseReceived = await routeHandlerWithoutConnectionInstance(
			req,
			res,
			next
		);
		expect(responseReceived.status).toEqual(400);
		expect(responseReceived.error).toMatch(
			/Transaction support hasn't been turned on/
		);
	});

	it("should return an error response if no operations are passed", async () => {
		const securityRules = { read: false, write: false };
		const routeHandler = mongodbRouteHandler(db, securityRules, connection);
		const req = generateRequest([]);
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.status).toEqual(400);
		expect(responseReceived.error).toMatch(
			/No operations passed for transaction/
		);
	});

	it("should return an error response if transaction fails", async () => {
		const securityRules = { read: false, write: false };
		const routeHandler = mongodbRouteHandler(db, securityRules, connection);
		const req = generateRequest([
			{
				collectionName: "projects",
				id: "project",
				operation: "set",
				newData: { a: 1 },
			},
			{
				collectionName: "projects",
				id: "project1",
				operation: "delete",
			},
			{
				collectionName: "projects",
				id: "project3",
				operation: "update",
				newData: { field: "updated_value" },
			},
		]);
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.status).toEqual(500);
	});
});
