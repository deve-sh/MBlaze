type AtomicOrderBy = { fieldName: string; order?: "asc" | "desc" };
type OrderBy = AtomicOrderBy | AtomicOrderBy[];

export default interface MiddlewareBody {
	collectionName: string;
	filters?: Record<string, any>;
	operation: "get" | "list" | "delete" | "update" | "set";
	limit?: number;
	offset?: number;
	orderBy?: OrderBy;
	newData?: Record<string, any>;
	merge?: boolean;
	id?: string;
}
