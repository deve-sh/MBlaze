import FetchedDoc from "./FetchedDoc";

class FetchedCollection {
	public docs: FetchedDoc[] = [];
	public empty: boolean = true;
	public collectionName: string;
	public forEach: ((docHandler: (doc: FetchedDoc) => any) => any) | null = null;

	constructor(collectionName: string, docs: Record<string, any>[]) {
		if (!collectionName)
			throw new Error(
				"Collection Name not provided at instantiation: FetchedCollection"
			);

		this.collectionName = collectionName;
		this.empty = !docs.length;
		this.docs = docs.map(
			(data) => new FetchedDoc(collectionName, data.id || data._id, data)
		);
		this.forEach = function (callback) {
			for (let i = 0; i < docs.length; i++) {
				callback(this.docs[i]);
			}
		};
	}
}

export default FetchedCollection;
