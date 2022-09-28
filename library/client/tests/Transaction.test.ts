import { describe, test, it, expect } from "@jest/globals";

import DB from "../src";
import Transaction from "../src/classes/Transaction";

describe("Transaction Tests", () => {
	const db = new DB("http://localhost:8080/mongodb");

	test("basic transaction tests", () => {
		expect(db.runTransaction).toBeInstanceOf(Function);
	});

	it("should receive transaction instance as an argument", () => {
		db.runTransaction((transaction) => {
			expect(transaction).toBeInstanceOf(Transaction);
		});
	});

	it("should have an operations list which increments after each operation", () => {
		db.runTransaction((transaction) => {
			expect(transaction.operationsList).toHaveLength(0);

			const docToSetRef = db.collection("projects").doc("project1");
			const docToUpdateRef = db.collection("projects").doc("projectToUpdate");
			const docToDeleteRef = db.collection("projects").doc("projectToDelete");

			transaction.set(docToSetRef, { fieldValue: "newValue" });
			expect(transaction.operationsList).toHaveLength(1);
			expect(transaction.operationsList[0].operation).toEqual("set");
			transaction.update(docToUpdateRef, { fieldValue: "newValue" });
			expect(transaction.operationsList).toHaveLength(2);
			expect(transaction.operationsList[1].operation).toEqual("update");
			transaction.delete(docToDeleteRef);
			expect(transaction.operationsList).toHaveLength(3);
			expect(transaction.operationsList[2].operation).toEqual("delete");
		});
	});

	it("should not allow operations when transaction is saving or completed", () => {
		db.runTransaction((transaction) => {
			transaction.saving = true;

			try {
				transaction.update(db.collection("projects").doc("project"), {});
			} catch (err) {
				expect(err.message).toMatch("Transaction is processing or completed");
			}
		});

		db.runTransaction((transaction) => {
			transaction.completed = true;

			try {
				transaction.set(db.collection("projects").doc("project"), {});
			} catch (err) {
				expect(err.message).toMatch("Transaction is processing or completed");
			}
		});
	});
});
