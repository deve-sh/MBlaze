// @ts-nocheck

import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import DB from "../src";
import setupSimpleMongoExpressServer from "./utils/setupSimpleMongoExpressServer";

let temporaryMongoDBServerCleanupFunction;

describe("Fallback URL Config Tests", () => {
	beforeAll(async () => {
		temporaryMongoDBServerCleanupFunction =
			await setupSimpleMongoExpressServer();
	});

	afterAll(async () => {
		if (temporaryMongoDBServerCleanupFunction)
			await temporaryMongoDBServerCleanupFunction();
	});

	const invalidURL = "http://localhost:8081/mongodb";
	const validURL = "http://localhost:8080/mongodb";
	const db = new DB(invalidURL, { fallbackURL: validURL });

	test("should use fallback url inc ase an invalid primary URL or failed primary url is passed", async () => {
		const data = await db.collection("projects").doc("abc").get();
		expect(data.id).toBe("abc"); // Should not fail.
	});
});
