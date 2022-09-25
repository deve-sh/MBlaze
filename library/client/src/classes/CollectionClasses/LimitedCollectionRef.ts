import CollectionClassConstructorArg from "../../types/collectionClassConstructorArg";
import BaseCollection from "./BaseCollectionRef";
import OffsetCollectionRef from "./OffsetCollectionRef";

class LimitedCollectionRef extends BaseCollection {
	private _args: CollectionClassConstructorArg;

	constructor(args: CollectionClassConstructorArg) {
		super(args);
		this._args = args;
	}

	offset(number: number) {
		return new OffsetCollectionRef({ ...this._args, offset: number });
	}
}

export default LimitedCollectionRef;
