// @ts-nocheck

import { describe, test, expect } from "@jest/globals";
import DB from "../src";

describe("Fallback URL Config Tests", () => {
	const db = new DB("http://localhost:8081/mongodb", {
		fallbackURL: "http://localhost:8080/mongodb",
	});

	test("should use fallback url inc ase an invalid primary URL or failed primary url is passed", async () => {
		const data = await db.collection("projects").doc("abc").get();
		expect(data.id).toBe("abc"); // Should not fail.
	});
});
