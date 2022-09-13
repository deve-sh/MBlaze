import { NextFunction, Request, Response } from "express";
import { Db } from "mongodb";
import { connect, disconnect } from "./utils/mongodb";
import mongodbRouteHandler from "../src";
import res, { generateRequest } from "./__mocks__/express";

describe("Get Operation Tests", () => {
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

	it("should return error in case collectionName is not passed", async () => {
		const req = generateRequest({});
		const responseReceived = await routeHandler(req, res, () => null);
		expect(responseReceived.error).toMatch(/Collection not provided/);
		expect(responseReceived.status).toBe(400);
	});

	it("should return error in case operation is not passed", async () => {
		const req = generateRequest({ collectionName: "projects" });
		const responseReceived = await routeHandler(req, res, () => null);
		expect(responseReceived.error).toMatch(/Operation not provided/);
		expect(responseReceived.status).toBe(400);
	});

	it("should return error in case document id is not passed for get operation", async () => {
		const req = generateRequest({
			collectionName: "projects",
			operation: "get",
		});
		const responseReceived = await routeHandler(req, res, () => null);
		expect(responseReceived.error).toMatch(/Document ID Required/);
		expect(responseReceived.status).toBe(400);
	});

	it("should return error in case document is not found for get operation", async () => {
		const req = generateRequest({
			collectionName: "projects",
			id: "project1",
			operation: "get",
		});
		const responseReceived = await routeHandler(req, res, () => null);
		expect(responseReceived.error).toMatch(/Document not found/);
		expect(responseReceived.status).toBe(404);
	});
});

describe("List Operation Tests", () => {
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

	it("should return an empty array in case documents matching filters are not found", async () => {
		const req = generateRequest({
			collectionName: "projects",
			operation: "list",
			filters: { a: 1, b: 2, c: 3 },
		});
		const responseReceived = await routeHandler(req, res, () => null);
		expect(responseReceived.documents).toHaveLength(0);
		expect(responseReceived.status).toBe(200);
	});
});
