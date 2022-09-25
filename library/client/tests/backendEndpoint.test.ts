import { describe, it, expect } from "@jest/globals";
import getBackendEndpoint from "../src/utils/getBackendEndpoint";
import DB from "../src";

describe("Test Suites for Backend Endpoint", () => {
	const backendEndpoint = "http://localhost:8080/mongodb";

	it("should set and get backend endpoint on instantiation", () => {
		new DB(backendEndpoint);
		expect(getBackendEndpoint()).toEqual(backendEndpoint);
	});

	it("should overwrite existing backend endpoint on instantiation", () => {
		new DB(backendEndpoint + "/new");
		expect(getBackendEndpoint()).toEqual(backendEndpoint + "/new");
	});
});
