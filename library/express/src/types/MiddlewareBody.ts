import type operations from "./operations";
import type { transactionBasedOperations } from "./operations";
import type sortOrder from "./sortOrder";

export type newData = Record<string, any>;

export interface RegularMiddlewareBody {
	collectionName: string;
	id?: string;
	filters?: Record<string, any>;
	operation: operations;
	limit?: number;
	offset?: number;
	newData?: newData;
	merge?: boolean;
	sortBy?: string;
	sortOrder?: sortOrder;
	fieldsSelectionRule?: Record<string, boolean | number>;
}

export interface TranscationMiddlewareBody {
	collectionName: string;
	id?: string;
	operation: transactionBasedOperations;
	newData?: Record<string, any>;
	merge?: boolean;
}

type MiddlewareBody = RegularMiddlewareBody | TranscationMiddlewareBody[];

export default MiddlewareBody;
