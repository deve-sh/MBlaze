import type { Request } from "express";
import type operations from "./operations";

export interface SecurityRulesDeciderFunctionArgs {
	req: Request;
	collection: string;
	id?: string;
	newResource?: Record<string, any> | null;
	resource?: Record<string, any> | null;
	filters?: Record<string, any> | null;
	operation?: operations | "create";
}

export type SecurityRulesDecider =
	| boolean
	| ((args: SecurityRulesDeciderFunctionArgs) => boolean | Promise<boolean>);

export interface SecurityRulesFragment {
	read?: SecurityRulesDecider;
	get?: SecurityRulesDecider;
	list?: SecurityRulesDecider;
	write?: SecurityRulesDecider;
	delete?: SecurityRulesDecider;
	create?: SecurityRulesDecider;
	update?: SecurityRulesDecider;
}

export type SecurityRules = Record<string, any>;

// Sample structure
/*
{
    read: true,
    write: ({ req, collection, id, newResource, resource }) => {
        Check for authorization headers or other data level checks to ensure if it should go through.
    },

    or granular levels

    get: ({ req, collection, id, resource }) => {

    },
    list: ({ req, collection, id, filters }) => {
        This is run only once, all checks should be based on filters to ensure that the user has access accordingly.
    },
    create: ({ req, collection, newResource }) => {

    },
    delete: ({ req, collection, id, resource }) => {

    },
    update: ({ req, collection, id, resource, newResource }) => {

    }

    or even more granular, to the collection itself
    [collectionName]: {
        read: true,
        wrtie: false
        ...
    }
}
*/
