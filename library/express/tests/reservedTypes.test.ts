import { describe, it, expect } from "@jest/globals";
import { FieldValue } from "mblaze.client";

import modifyObjectForReservedFieldTypes from "../src/reservedFieldTypes/modifyObjectForReservedTypes";
import { ARRAY_UNION_OP_CODE } from "../src/reservedFieldTypes/arrayUnion";
import { INCREMENT_OP_CODE } from "../src/reservedFieldTypes/increment";
import { ARRAY_REMOVE_OP_CODE } from "../src/reservedFieldTypes/arrayRemove";
import { FIELD_DELETE_OP_CODE } from "../src/reservedFieldTypes/fieldDelete";

describe("Reserved Type Tests", () => {
	describe("modifyObjectForReservedTypes tests", () => {
		it("should recognize FieldValue objects", () => {
			expect(
				modifyObjectForReservedFieldTypes({ field: FieldValue.increment(10) })[
					INCREMENT_OP_CODE
				].field
			).toBe(10);

			expect(
				modifyObjectForReservedFieldTypes({ field: FieldValue.arrayUnion(15) })[
					ARRAY_UNION_OP_CODE
				].field
			).toBe(15);

			expect(
				modifyObjectForReservedFieldTypes({ field: FieldValue.delete() })[
					FIELD_DELETE_OP_CODE
				].field
			).toBe("");

			expect(
				modifyObjectForReservedFieldTypes({ field: FieldValue.arrayRemove(5) })[
					ARRAY_REMOVE_OP_CODE
				].field
			).toBe(5);

			expect(
				modifyObjectForReservedFieldTypes({
					field: FieldValue.arrayUnion(15),
					field1: FieldValue.serverTimestamp(),
				}).field1
			).toBeInstanceOf(Date);
		});

		it("should map out the passed object correctly", () => {
			expect(
				Object.keys(
					modifyObjectForReservedFieldTypes({
						field: FieldValue.arrayUnion(15),
						field1: FieldValue.serverTimestamp(),
						nestedField: {
							arrayToRemoveFrom: FieldValue.arrayRemove(5),
						},
					})
				).length
			).toEqual(3);
		});

		it("should handle nesting of reserved fields properly", () => {
			const nestedOps = modifyObjectForReservedFieldTypes({
				regularField: FieldValue.arrayUnion(20),
				nestedField: {
					a: {
						b: {
							c: FieldValue.increment(5),
						},
					},
				},
				nestedField1: {
					arrayToRemoveFrom: FieldValue.arrayRemove(5),
				},
				fieldToDeleteCompletely: {
					nested: { field: FieldValue.delete() },
				},
			});
			expect(
				nestedOps[ARRAY_REMOVE_OP_CODE]["nestedField1.arrayToRemoveFrom"]
			).toEqual(5);
			expect(nestedOps[ARRAY_UNION_OP_CODE]["regularField"]).toEqual(20);
			expect(nestedOps[INCREMENT_OP_CODE]["nestedField.a.b.c"]).toEqual(5);
			expect(
				nestedOps[FIELD_DELETE_OP_CODE]["fieldToDeleteCompletely.nested.field"]
			).toEqual("");
		});

		it("should handle multiple similar ops", () => {
			const multipleArrayUnionOps = modifyObjectForReservedFieldTypes({
				"nestedField.arrayValue": FieldValue.arrayUnion(15),
				"nestedField.anotherArrayValue": FieldValue.arrayUnion(10),
			});

			expect(
				multipleArrayUnionOps[ARRAY_UNION_OP_CODE]["nestedField.arrayValue"]
			).toEqual(15);
			expect(
				multipleArrayUnionOps[ARRAY_UNION_OP_CODE][
					"nestedField.anotherArrayValue"
				]
			).toEqual(10);

			const multipleArrayRemoveOps = modifyObjectForReservedFieldTypes({
				"nestedField.arrayValue": FieldValue.arrayRemove(15),
				"nestedField.anotherArrayValue": FieldValue.arrayRemove(10),
			});

			expect(
				multipleArrayRemoveOps[ARRAY_REMOVE_OP_CODE]["nestedField.arrayValue"]
			).toEqual(15);
			expect(
				multipleArrayRemoveOps[ARRAY_REMOVE_OP_CODE][
					"nestedField.anotherArrayValue"
				]
			).toEqual(10);

			const multipleIncrementOps = modifyObjectForReservedFieldTypes({
				"nestedField.arrayValue": FieldValue.increment(15),
				"nestedField.anotherArrayValue": FieldValue.increment(10),
			});

			expect(
				multipleIncrementOps[INCREMENT_OP_CODE]["nestedField.arrayValue"]
			).toEqual(15);
			expect(
				multipleIncrementOps[INCREMENT_OP_CODE]["nestedField.anotherArrayValue"]
			).toEqual(10);

			const multipleDeleteOps = modifyObjectForReservedFieldTypes({
				regularValue: FieldValue.delete(),
				"nestedField.arrayValue": FieldValue.delete(),
				"nestedField.anotherArrayValue": FieldValue.delete(),
			});

			expect(multipleDeleteOps[FIELD_DELETE_OP_CODE]["regularValue"]).toEqual(
				""
			);
			expect(
				multipleDeleteOps[FIELD_DELETE_OP_CODE]["nestedField.arrayValue"]
			).toEqual("");
			expect(
				multipleDeleteOps[FIELD_DELETE_OP_CODE]["nestedField.anotherArrayValue"]
			).toEqual("");
		});
	});
});
