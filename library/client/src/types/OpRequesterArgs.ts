import operations from "./operations";

interface OpRequesterArgs {
	operation: operations;
	collectionName: string;
	id?: string;
	filters?: Record<string, any> | null;
	newData?: Record<string, any> | null;
	limit?: number;
	offset?: number;
	merge?: boolean;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	fieldsSelectionRule?: Record<string, boolean | number>;
}

export default OpRequesterArgs;
