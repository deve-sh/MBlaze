import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import { Db } from "mongodb";
import { connect, disconnect } from "./utils/mongodb";
import mongodbRouteHandler from "../src";
import { res, generateRequest, next } from "./__mocks__/express";

describe("Count Operation Tests", () => {
	let db: Db;
	let routeHandler: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<any>;

	beforeAll(async () => {
		await connect().then((vals) => {
			db = vals.db;
			routeHandler = mongodbRouteHandler(db);
		});
	});

	afterAll(disconnect);

	it("should return 0 as count for filters not matching any documents", async () => {
		const req = generateRequest({
			collectionName: "projects",
			operation: "count",
			filters: { a: 1, b: 2, c: 3 },
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.count).toBe(0);
		expect(responseReceived.status).toBe(200);
	});

	it("should return error in case security rules prohibit list operations as count operations are dependent on list operations", async () => {
		const originalRouteHandler = routeHandler;

		routeHandler = mongodbRouteHandler(db, {
			read: ({ filters }) => filters.field !== "value",
		});
		const req = generateRequest({
			collectionName: "projects",
			filters: { field: "value" },
			operation: "count",
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.error).toMatch(/Insufficient Permissions/);
		expect(responseReceived.status).toBe(401);

		routeHandler = originalRouteHandler;
	});

	it("should return valid count of documents matching filters", async () => {
		// First create documents
		let req1 = generateRequest({
			collectionName: "projects",
			operation: "set",
			newData: { field: "value" },
			id: "project1",
		});
		let req2 = generateRequest({
			collectionName: "projects",
			operation: "set",
			newData: { field: "value" },
			id: "project2",
		});
		await Promise.all([
			routeHandler(req1, res, next),
			routeHandler(req2, res, next),
		]);

		// Now find documents
		const req = generateRequest({
			collectionName: "projects",
			operation: "count",
			filters: { field: "value" },
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.count).toBe(2);
		expect(responseReceived.status).toBe(200);
	});
});
