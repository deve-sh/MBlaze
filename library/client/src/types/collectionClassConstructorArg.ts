export default interface CollectionClassConstructorArg {
	collectionName: string;
	filters?: Record<string, any>;
	limit?: number;
	offset?: number;
	sortByField?: string;
	sortOrder?: "asc" | "desc";
	fieldsSelectionRule?: Record<string, boolean | number>;
}
