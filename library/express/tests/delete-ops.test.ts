import { NextFunction, Request, response, Response } from "express";
import { Db } from "mongodb";
import { connect, disconnect } from "./utils/mongodb";
import mongodbRouteHandler from "../src";
import res, { generateRequest } from "./__mocks__/express";

describe("Delete Operation Tests", () => {
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

	it("should return error in case document is not found", async () => {
		const req = generateRequest({
			collectionName: "projects",
			operation: "delete",
			id: "project2",
		});
		const responseReceived = await routeHandler(req, res, () => null);
		expect(responseReceived.error).toMatch(/Document not found/);
		expect(responseReceived.status).toBe(404);
	});

	it("should return 204 if data is successfully deleted", async () => {
		// First create data
		let req = generateRequest({
			collectionName: "projects",
			operation: "set",
			id: "project1",
			newData: { field: "value" },
		});
		await routeHandler(req, res, () => null);

		// Now delete the created data
		req = generateRequest({
			collectionName: "projects",
			operation: "delete",
			id: "project1",
		});
		const responseReceived = await routeHandler(req, res, () => null);
		expect(responseReceived.status).toBe(204);
	});
});
