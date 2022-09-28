import { describe, it, expect } from "@jest/globals";
import { FieldValue } from "mblaze.client";

import modifyObjectForReservedFieldTypes from "../src/reservedFieldTypes/modifyObjectForReservedTypes";
import { ARRAY_UNION_OP_CODE } from "../src/reservedFieldTypes/arrayUnion";
import { INCREMENT_OP_CODE } from "../src/reservedFieldTypes/increment";
import { ARRAY_REMOVE_OP_CODE } from "../src/reservedFieldTypes/arrayRemove";

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
							createdAt: FieldValue.arrayRemove(5),
						},
					})
				).length
			).toEqual(3);
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
		});
	});
});
