import { NextFunction, Request, Response } from "express";
import { Db } from "mongodb";
import { connect, disconnect } from "./utils/mongodb";
import mongodbRouteHandler from "../src";
import { res, generateRequest, next } from "./__mocks__/express";

describe("Update Operation Tests", () => {
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

	it("should return error in case newData is not passed", async () => {
		const req = generateRequest({
			collectionName: "projects",
			operation: "update",
			id: "project2",
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.error).toMatch(/New Data is required for updation/);
		expect(responseReceived.status).toBe(400);
	});

	it("should return error in case id is not passed", async () => {
		const req = generateRequest({
			collectionName: "projects",
			operation: "update",
			newData: { fieldToUpdate: "updated_field" },
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.error).toMatch(/Document ID is required/);
		expect(responseReceived.status).toBe(400);
	});

	it("should return error in case document is not found", async () => {
		const req = generateRequest({
			collectionName: "projects",
			operation: "update",
			id: "project2",
			newData: { fieldToUpdate: "updated_field" },
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.error).toMatch(/Document not found/);
		expect(responseReceived.status).toBe(404);
	});

	it("should return 200 if data is successfully updated", async () => {
		// First create data
		let req = generateRequest({
			collectionName: "projects",
			operation: "set",
			id: "project1",
			newData: { field: "value" },
		});
		await routeHandler(req, res, next);

		// Now delete the created data
		req = generateRequest({
			collectionName: "projects",
			operation: "update",
			id: "project1",
			newData: { field: "updated_value" },
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.status).toBe(200);
		expect(responseReceived.acknowledged).toEqual(true);
		expect(responseReceived.modifiedCount).toEqual(1);
	});
});