import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import { Db } from "mongodb";
import { connect, disconnect } from "./utils/mongodb";
import mongodbRouteHandler from "../src";
import { res, generateRequest, next } from "./__mocks__/express";

describe("Selective Fields Querying Tests", () => {
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

	it("should return all fields when none are specified", async () => {
		// First create documents
		let creationRequest = generateRequest({
			collectionName: "projects",
			operation: "set",
			newData: { field: "value", field2: "value2" },
			id: "project1",
		});
		await routeHandler(creationRequest, res, next);

		// Now find documents
		const req = generateRequest({
			collectionName: "projects",
			operation: "list",
			filters: { field: "value" },
			fieldsSelectionRule: {},
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.status).toBe(200);
		expect(responseReceived.documents[0].field).toEqual("value");
		expect(responseReceived.documents[0].field2).toEqual("value2");
	});

	it("should return only one field when specified", async () => {
		// First create documents
		let creationRequest = generateRequest({
			collectionName: "projects",
			operation: "set",
			newData: { field: "value", field2: "value2" },
			id: "project1",
		});
		await routeHandler(creationRequest, res, next);

		// Now find documents
		const req = generateRequest({
			collectionName: "projects",
			operation: "list",
			filters: { field: "value" },
			fieldsSelectionRule: { field2: 0, _id: false },
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.status).toBe(200);
		expect(responseReceived.documents[0].field).toEqual("value");
		expect(responseReceived.documents[0].field2).toEqual(undefined);
		expect(responseReceived.documents[0]._id).toEqual(undefined);
	});
});
