// @ts-nocheck

import { describe, it, test, expect } from "@jest/globals";
import DB from "../src";

describe("Collection + Chaining Tests", () => {
	const db = new DB("http://localhost:8080/mongodb");
	it("should throw error in case collection name is not passed", () => {
		try {
			// @ts-ignore
			db.collection();
		} catch (err) {
			expect(err.message).toMatch("Collection Name not provided");
		}
	});

	test("other basic collection tests", () => {
		expect(db.collection("projects").collectionName).toBe("projects");
	});

	test("chaining tests: positive", () => {
		expect(db.collection("projects").doc).toBeInstanceOf(Function);
		expect(db.collection("projects").get).toBeInstanceOf(Function);
		expect(db.collection("projects").limit).toBeInstanceOf(Function);
		expect(db.collection("projects").offset).toBeInstanceOf(Function);
		expect(db.collection("projects").where).toBeInstanceOf(Function);
		expect(db.collection("projects").filter).toBeInstanceOf(Function);
		expect(db.collection("projects").orderBy).toBeInstanceOf(Function);
	});

	test("chaining tests: negative", () => {
		expect(db.collection("projects").doc("project1").where).not.toBeInstanceOf(
			Function
		);
		expect(db.collection("projects").orderBy("field").where).not.toBeInstanceOf(
			Function
		);
		expect(db.collection("projects").limit(1000).where).not.toBeInstanceOf(
			Function
		);
		expect(db.collection("projects").limit(1000).filter).not.toBeInstanceOf(
			Function
		);
	});
});
