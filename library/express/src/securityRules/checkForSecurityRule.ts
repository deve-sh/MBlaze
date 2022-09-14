import type { Request } from "express";
import operations from "../types/operations";
import { SecurityRules, SecurityRulesDecider } from "../types/securityRules";

interface SecurityRulesCheckerArgs {
	req: Request;
	collection: string;
	id?: string;
	newResource?: Record<string, any>;
	resource?: Record<string, any>;
	filters?: Record<string, any>;
	operation: operations;
}

const readOps = ["get", "list"];
const writeOps = ["create", "update", "delete"];

const checkForSecurityRule = async (
	args: SecurityRulesCheckerArgs,
	securityRulesObject: SecurityRules
) => {
	const { req, collection, id, newResource, resource, filters, operation } =
		args;

	const ruleEvaluator = async (decider: SecurityRulesDecider) => {
		if (typeof decider === "boolean") return decider;
		if (typeof decider === "function")
			return await decider({
				req,
				collection,
				id,
				newResource,
				resource,
				filters,
			});
		return false;
	};

	// If no security rules, let everything pass.
	if (!securityRulesObject) return true;

	// Get the most granular collection-level rules out of the way.
	const collectionLevelRules = securityRulesObject[collection];
	if (collectionLevelRules) {
		const collectionLevelOpRule = collectionLevelRules[operation];
		if (collectionLevelOpRule)
			return await ruleEvaluator(collectionLevelOpRule);
		else {
			// Check for less-granular collection-level rules like 'read', 'write'
			if (readOps.includes(operation) && collectionLevelRules.read)
				return await ruleEvaluator(collectionLevelRules.read);
			if (writeOps.includes(operation) && collectionLevelRules.write)
				return await ruleEvaluator(collectionLevelRules.write);
		}
	}

	// Less granular
	if (securityRulesObject[operation]) {
		const rootLevelOpRule = securityRulesObject[operation];
		return await ruleEvaluator(rootLevelOpRule);
	} else {
		if (readOps.includes(operation) && securityRulesObject.read)
			return await ruleEvaluator(securityRulesObject.read);
		if (writeOps.includes(operation) && securityRulesObject.write)
			return await ruleEvaluator(securityRulesObject.write);
	}

	return false;
};

export default checkForSecurityRule;
