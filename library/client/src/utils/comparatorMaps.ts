import comparatorType from "../types/comparator";

const comparatorMap = (
	comparator: comparatorType,
	value: any
): Record<string, any> | any => {
	if (comparator === "==") return { $eq: value };
	if (comparator === "!=") return { $ne: value };
	if (comparator === "<=") return { $lte: value };
	if (comparator === ">=") return { $gte: value };
	if (comparator === "<") return { $lt: value };
	if (comparator === ">") return { $gt: value };
	if (comparator === "array-contains") return value; // MongoDB auto checks { field: value } for array membership.
	if (comparator === "array-contains-any")
		return { $elemMatch: comparatorMap("in", value) };
	if (comparator === "in") return { $in: Array.isArray(value) ? value : [] };
	if (comparator === "not-in")
		return { $nin: Array.isArray(value) ? value : [] };
};

export default comparatorMap;
