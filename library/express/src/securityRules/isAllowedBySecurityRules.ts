import type { Request } from "express";
import operations from "../types/operations";
import { SecurityRules, SecurityRulesDecider } from "../types/securityRules";

export interface SecurityRulesCheckerArgs {
	req?: Request;
	collection: string;
	id?: string;
	newResource?: Record<string, any> | null;
	resource?: Record<string, any> | null;
	filters?: Record<string, any> | null;
	operation: operations | "create";
}

const readOps = ["get", "list"];
const writeOps = ["create", "update", "delete"];

const isAllowedBySecurityRules = async (
	args: SecurityRulesCheckerArgs,
	securityRulesObject?: SecurityRules
) => {
	try {
		const { req, collection, id, newResource, resource, filters, operation } =
			args;

		const ruleEvaluator = async (decider: SecurityRulesDecider) => {
			if (typeof decider === "boolean") return decider;
			if (typeof decider === "function")
				return (
					(await decider({
						req: req || ({} as Request),
						collection,
						id,
						newResource,
						resource,
						filters,
						operation,
					})) || false
				);
			return false;
		};

		// If no security rules, let everything pass.
		if (!securityRulesObject) return true;

		// Get the most granular collection-level rules out of the way.
		const collectionLevelRules = securityRulesObject[collection];
		if (collectionLevelRules && typeof collectionLevelRules === "object") {
			const collectionLevelOpRule = collectionLevelRules[operation];
			if (operation in collectionLevelRules)
				return await ruleEvaluator(collectionLevelOpRule);
			else {
				// Check for less-granular collection-level rules like 'read', 'write'
				if (readOps.includes(operation) && "read" in collectionLevelRules)
					return await ruleEvaluator(collectionLevelRules.read);
				if (writeOps.includes(operation) && "write" in collectionLevelRules)
					return await ruleEvaluator(collectionLevelRules.write);
			}
		}

		// Less granular
		if (operation in securityRulesObject) {
			const rootLevelOpRule = securityRulesObject[operation];
			return await ruleEvaluator(rootLevelOpRule);
		} else {
			if (readOps.includes(operation) && "read" in securityRulesObject)
				return await ruleEvaluator(securityRulesObject.read);
			if (writeOps.includes(operation) && "write" in securityRulesObject)
				return await ruleEvaluator(securityRulesObject.write);
		}

		return false;
	} catch {
		return false;
	}
};

export default isAllowedBySecurityRules;
