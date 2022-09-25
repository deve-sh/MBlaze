import { describe, it, expect } from "@jest/globals";
import getBackendEndpoint from "../src/utils/getBackendEndpoint";
import DB from "../src";
import getRequestConfig from "../src/utils/getRequestConfig";

describe("Test Suites for Request Config", () => {
	const backendEndpoint = "http://localhost:8080/mongodb";
	const requestConfig = {
		headers: {
			Authorization: "Bearer token",
		},
	};

	const getToken = "Bearer getToken";
	const postToken = "Bearer postToken";
	const functionRequestConfig = ({ operation }) => {
		if (operation === "get") return { headers: { Authorization: getToken } };
		return { headers: { Authorization: postToken } };
	};

	it("should set and get backend endpoint on instantiation", () => {
		new DB(backendEndpoint, requestConfig);
		expect(
			getRequestConfig({ operation: "get", collectionName: "projects" }).headers
				?.Authorization
		).toEqual(requestConfig.headers.Authorization);
	});

	it("should overwrite existing backend endpoint on instantiation", () => {
		new DB(backendEndpoint, functionRequestConfig);
		expect(
			getRequestConfig({ operation: "get", collectionName: "projects" }).headers
				?.Authorization
		).toEqual(getToken);
		expect(
			getRequestConfig({ operation: "set", collectionName: "projects" }).headers
				?.Authorization
		).toEqual(postToken);
	});
});
