import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import { Db } from "mongodb";
import { FieldValue } from "mblaze.client";
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
			newData: {
				field: "value",
				incrementMe: 1,
				fieldToBeDeleted: "",
				arrayField: [],
				arrayToRemoveField: [10],
			},
		});
		await routeHandler(req, res, next);

		// Now update the created data
		req = generateRequest({
			collectionName: "projects",
			operation: "update",
			id: "project1",
			newData: {
				field: "updated_value",
				timestampField: FieldValue.serverTimestamp(),
				incrementMe: FieldValue.increment(1),
				fieldToBeDeleted: FieldValue.delete(),
				arrayField: FieldValue.arrayUnion(5),
				arrayToRemoveField: FieldValue.arrayRemove(10),
				nestedField: { a: { b: { c: FieldValue.serverTimestamp() } } },
			},
		});
		let responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.status).toBe(200);
		expect(responseReceived.acknowledged).toEqual(true);
		expect(responseReceived.modifiedCount).toEqual(1);

		// Now read the updated document
		req = generateRequest({
			collectionName: "projects",
			operation: "get",
			id: "project1",
		});
		responseReceived = await routeHandler(req, res, next);
		expect(new Date(responseReceived.document.timestampField)).toBeInstanceOf(
			Date
		);
		expect(
			new Date(responseReceived.document.nestedField.a.b.c)
		).toBeInstanceOf(Date);
		expect(responseReceived.document.incrementMe).toBe(2);
		expect(responseReceived.document.fieldToBeDeleted).toBeFalsy();
		expect(responseReceived.document.arrayField.length).toBe(1);
		expect(responseReceived.document.arrayToRemoveField.length).toBe(0);
	});

	it("should not update id of a document even if passed in newData", async () => {
		// First create data
		let req = generateRequest({
			collectionName: "projects",
			operation: "set",
			id: "project1",
			newData: { field: "value" },
		});
		await routeHandler(req, res, next);

		// Now update the created data
		req = generateRequest({
			collectionName: "projects",
			operation: "update",
			id: "project1",
			newData: { field: "updated_value", id: "project2" },
		});
		await routeHandler(req, res, next);

		// Now read the updated document
		req = generateRequest({
			collectionName: "projects",
			operation: "get",
			id: "project1",
		});
		const responseReceived = await routeHandler(req, res, next);
		expect(responseReceived.document._id).toEqual("project1");
	});
});
