import { describe, it, expect } from "@jest/globals";
import DB from "../src";

describe("Basic Tests", () => {
	it("should expose a default class", () => {
		expect(DB).toBeTruthy();
		expect(DB).toBeInstanceOf(Function);
	});

	it("should throw error in case backend endpoint is not passed", () => {
		try {
			// @ts-ignore
			const db = new DB();
		} catch (instantiationError) {
			expect(instantiationError.message).toMatch(
				"Backend Endpoint not provided at instantiation: DB"
			);
		}
	});

	it("should provide doc and collection classes on instantiation", () => {
		const db = new DB("http://localhost:8080/mongodb");
		expect(db.collection).toBeTruthy();
		expect(db.collection).toBeInstanceOf(Function);
		expect(db.doc).toBeTruthy();
		expect(db.doc).toBeInstanceOf(Function);
	});
});
