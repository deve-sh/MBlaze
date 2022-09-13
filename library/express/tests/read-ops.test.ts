import { NextFunction, Request, Response } from "express";
import { Db } from "mongodb";
import { connect, disconnect } from "./utils/mongodb";
import mongodbRouteHandler from "../src";
import { res, generateRequest, next } from "./__mocks__/express";

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
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.error).toMatch(/Collection not provided/);
		expect(responseReceived.status).toBe(400);
	});

	it("should return error in case operation is not passed", async () => {
		const req = generateRequest({ collectionName: "projects" });
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.error).toMatch(/Operation not provided/);
		expect(responseReceived.status).toBe(400);
	});

	it("should return error in case document id is not passed for get operation", async () => {
		const req = generateRequest({
			collectionName: "projects",
			operation: "get",
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.error).toMatch(/Document ID Required/);
		expect(responseReceived.status).toBe(400);
	});

	it("should return error in case document is not found for get operation", async () => {
		const req = generateRequest({
			collectionName: "projects",
			id: "project1",
			operation: "get",
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.error).toMatch(/Document not found/);
		expect(responseReceived.status).toBe(404);
	});

	it("should return document if it exists", async () => {
		// First create document
		let req = generateRequest({
			collectionName: "projects",
			operation: "set",
			newData: { field: "value" },
			id: "project1",
		});
		await routeHandler(req, res, next);

		// Now find document
		req = generateRequest({
			collectionName: "projects",
			operation: "get",
			id: "project1",
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.document._id).toEqual("project1");
		expect(responseReceived.status).toBe(200);
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
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.documents).toHaveLength(0);
		expect(responseReceived.status).toBe(200);
	});

	it("should return all correct documents matching filters", async () => {
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
			operation: "list",
			filters: { field: "value" },
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.documents).toHaveLength(2);
		expect(responseReceived.status).toBe(200);
	});
});
