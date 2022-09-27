// @ts-nocheck

import { describe, test, expect } from "@jest/globals";
import DB from "../src";

describe("Doc Tests", () => {
	const db = new DB("http://localhost:8080/mongodb");

	test("basic doc tests", () => {
		expect(db.collection("projects").doc().collectionName).toBe("projects");
		expect(db.collection("projects").doc().id).not.toBeFalsy();
	});
});
