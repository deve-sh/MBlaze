import type operations from "./operations";
import type sortOrder from "./sortOrder";

type AtomicOrderBy = { fieldName: string; order?: "asc" | "desc" };
type OrderBy = AtomicOrderBy | AtomicOrderBy[];

export default interface MiddlewareBody {
	collectionName: string;
	filters?: Record<string, any>;
	operation: operations;
	limit?: number;
	offset?: number;
	orderBy?: OrderBy;
	newData?: Record<string, any>;
	merge?: boolean;
	id?: string;
	sortBy?: string;
	sortOrder?: sortOrder;
}
