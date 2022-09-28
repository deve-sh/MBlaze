import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import { Db } from "mongodb";
import { FieldValue } from "mblaze.client";
import { connect, disconnect } from "./utils/mongodb";
import mongodbRouteHandler from "../src";
import { res, generateRequest, next } from "./__mocks__/express";

describe("Set Operation Tests", () => {
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
			operation: "set",
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.error).toMatch(/New Data is required/);
		expect(responseReceived.status).toBe(400);
	});

	it("should insert new data if id is not passed", async () => {
		const req = generateRequest({
			collectionName: "projects",
			operation: "set",
			newData: { field: "value" },
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.acknowledged).toBe(true);
		expect(responseReceived.status).toBe(201);
	});

	it("should insert new data with defined id if id is passed", async () => {
		const req = generateRequest({
			collectionName: "projects",
			operation: "set",
			newData: { field: "value" },
			id: "project1",
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.acknowledged).toBe(true);
		expect(responseReceived.insertedId).toEqual("project1");
		expect(responseReceived.status).toBe(201);
	});

	it("should replace existing data with id", async () => {
		const req = generateRequest({
			collectionName: "projects",
			operation: "set",
			newData: { field: "updated_value" },
			id: "project1",
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.acknowledged).toBe(true);
		expect(responseReceived.modifiedCount).toEqual(1);
		expect(responseReceived.status).toBe(200);
	});

	it("should update existing data with id if merge: true is passed", async () => {
		let req = generateRequest({
			collectionName: "projects",
			operation: "set",
			newData: {
				field1: "new_value",
				field2: FieldValue.serverTimestamp(),
				arrayField: FieldValue.arrayUnion(5),
			},
			id: "project1",
			merge: true,
		});
		let responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.acknowledged).toBe(true);
		expect(responseReceived.modifiedCount).toEqual(1);
		expect(responseReceived.status).toBe(200);

		// Now read the updated document
		req = generateRequest({
			collectionName: "projects",
			operation: "get",
			id: "project1",
		});
		responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.document._id).toEqual("project1");
		expect(responseReceived.document.arrayField.length).toEqual(1);
		expect(new Date(responseReceived.document.field2)).toBeInstanceOf(Date);
	});
});
