import type { Request } from "express";
import isAllowedBySecurityRules, {
	SecurityRulesCheckerArgs,
} from "../src/securityRules/isAllowedBySecurityRules";
import { SecurityRulesDeciderFunctionArgs } from "../src/types/securityRules";

describe("Test suite for security rules", () => {
	it("should be a function", () => {
		expect(isAllowedBySecurityRules).toBeInstanceOf(Function);
	});

	it("should pass the correct values and number of arguments to the decider function", async () => {
		let readArgsPassed;
		let creationArgsPassed;
		let listArgsPassed;
		let updationArgsPassed;
		let deletionArgsPassed;
		const mockSecurityRules = {
			get: (args: SecurityRulesDeciderFunctionArgs) => {
				readArgsPassed = args;
				return true;
			},
			create: (args: SecurityRulesDeciderFunctionArgs) => {
				creationArgsPassed = args;
				return true;
			},
			list: (args: SecurityRulesDeciderFunctionArgs) => {
				listArgsPassed = args;
				return true;
			},
			update: (args: SecurityRulesDeciderFunctionArgs) => {
				updationArgsPassed = args;
				return true;
			},
			delete: (args: SecurityRulesDeciderFunctionArgs) => {
				deletionArgsPassed = args;
				return true;
			},
		};
		const readOperation: SecurityRulesCheckerArgs = {
			req: { headers: { authorization: "abc" } } as Request,
			collection: "projects",
			operation: "get",
			id: "project1",
		};
		const createOperation: SecurityRulesCheckerArgs = {
			collection: "projects",
			operation: "create",
			id: "new-project",
			newResource: { field: "value" },
		};
		const listOperation: SecurityRulesCheckerArgs = {
			collection: "projects",
			operation: "list",
			filters: { field: "value" },
		};
		const updateOperation: SecurityRulesCheckerArgs = {
			collection: "projects",
			operation: "update",
			filters: { field: "value" },
			resource: { field: "existing_value" },
			newResource: { field: "new_value", field1: "new_field" },
		};
		const deleteOperation: SecurityRulesCheckerArgs = {
			collection: "projects",
			operation: "delete",
			id: "project-to-delete",
			resource: { field: "existing_value" },
			newResource: null,
		};
		await Promise.all([
			isAllowedBySecurityRules(createOperation, mockSecurityRules),
			isAllowedBySecurityRules(readOperation, mockSecurityRules),
			isAllowedBySecurityRules(listOperation, mockSecurityRules),
			isAllowedBySecurityRules(updateOperation, mockSecurityRules),
			isAllowedBySecurityRules(deleteOperation, mockSecurityRules),
		]);
		// Read args checks
		expect(readArgsPassed.collection).toBe("projects");
		expect(readArgsPassed.id).toBe("project1");
		expect(readArgsPassed.newResource).toBeFalsy();
		expect(readArgsPassed.req.headers.authorization).toBe("abc");
		// Create args checks
		expect(creationArgsPassed.collection).toBe("projects");
		expect(creationArgsPassed.id).toBe("new-project");
		expect(creationArgsPassed.resource).toBeFalsy();
		expect(creationArgsPassed.newResource.field).toEqual("value");
		// Update args checks
		expect(updationArgsPassed.resource.field).toEqual("existing_value");
		expect(updationArgsPassed.newResource.field).toEqual("new_value");
		expect(updationArgsPassed.newResource.field1).toEqual("new_field");
		// List args checks
		expect(listArgsPassed.filters.field).toEqual("value");
		// Deletion args checks
		expect(deletionArgsPassed.resource.field).toEqual("existing_value");
		expect(deletionArgsPassed.newResource).toBeFalsy();
		expect(deletionArgsPassed.id).toEqual("project-to-delete");
	});

	it("should return false if root read and write ops are not permitted", async () => {
		const mockSecurityRules = {
			read: false,
			write: false,
		};
		expect(
			await isAllowedBySecurityRules(
				{ collection: "projects", operation: "get", id: "project1" },
				mockSecurityRules
			)
		).toBe(false);
		expect(
			await isAllowedBySecurityRules(
				{ collection: "projects", operation: "create", id: "project1" },
				mockSecurityRules
			)
		).toBe(false);
	});

	it("should return true if root read and write ops are permitted", async () => {
		const mockSecurityRules = {
			read: () => true,
			write: () => true,
		};
		expect(
			await isAllowedBySecurityRules(
				{ collection: "projects", operation: "list" },
				mockSecurityRules
			)
		).toBe(true);
		expect(
			await isAllowedBySecurityRules(
				{ collection: "projects", operation: "update", id: "project1" },
				mockSecurityRules
			)
		).toBe(true);
	});

	it("should use collection-level rules if available", async () => {
		const mockSecurityRules = {
			read: () => true,
			write: () => false,
			projects: {
				read: false,
				write: true,
			},
		};
		const listOperation: SecurityRulesCheckerArgs = {
			collection: "projects",
			operation: "list",
		};
		const updateOperation: SecurityRulesCheckerArgs = {
			collection: "projects",
			operation: "update",
			id: "project1",
		};
		expect(
			await isAllowedBySecurityRules(listOperation, mockSecurityRules)
		).toBe(false);
		expect(
			await isAllowedBySecurityRules(updateOperation, mockSecurityRules)
		).toBe(true);
	});

	it("should use granular-level rules if available", async () => {
		const mockSecurityRules = {
			write: () => false,
			create: true,
		};
		const createOperation: SecurityRulesCheckerArgs = {
			collection: "projects",
			operation: "create",
			id: "project1",
			newResource: { field: "value" },
		};
		expect(
			await isAllowedBySecurityRules(createOperation, mockSecurityRules)
		).toBe(true);
	});

	it("should use granular-level rules if available inside collection-level", async () => {
		const mockSecurityRules = {
			write: () => false,
			create: true,
			projects: {
				write: async ({ id }) => {
					if (id === "project1") return false;
					return true;
				},
				create: async ({ id }) => {
					if (id === "project1") return true;
					return false;
				},
			},
		};
		const createOperation: SecurityRulesCheckerArgs = {
			collection: "projects",
			operation: "create",
			id: "project1",
			newResource: { field: "value" },
		};
		expect(
			await isAllowedBySecurityRules(createOperation, mockSecurityRules)
		).toBe(true);
	});
});
