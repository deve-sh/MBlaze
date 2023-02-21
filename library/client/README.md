# MBlaze - Client Library

JavaScript library to connect to your express app's MongoDB driver.

#### Before Getting Started

[Get to know a little about the project](https://github.com/deve-sh/MBlaze#readme).

Make sure you have the express middleware library installed and setup on your Express app using the [steps here](https://npmjs.com/package/mblaze.express).

### Setup and Usage

```bash
npm i --save mblaze.client
# or
yarn add mblaze.client
```

```javascript
import DB from "mblaze.client";

const { BACKEND_MONGODB_ENDPOINT } = process.env;
const db = new DB(BACKEND_MONGODB_ENDPOINT); // This is your global mblaze instance
```

---

### Querying Data

```javascript
const queryResults = await db.collection("projects").get(); // Gets 100 documents from the collection by default.

queryResults.forEach((doc) =>
	console.log(doc.id, doc.exists, doc.ref, doc.data())
);
queryResults.empty; // boolean
queryResults.docs; // [FetchedDoc, FetchedDoc, ...]
```

##### Listing Based on Conditionals

```javascript
await db.collection("projects").where("field", "==", value).get();

await db
	.collection("projects")
	.where("nestedField.furtherNesting.evenFurtherNesting", "!=", value)
	.get();
```

Comparison Operations supported:

- `==`
- `!=`
- `>`
- `<`
- `>=`
- `<=`
- `in`
- `not-in`
- `array-contains`
- `array-contains-any`

##### When simple queries just don't cut it

MongoDB is great at querying data, so why be limited? This lets you run complex queries with even `or` conditions.

```javascript
await db
	.collection("projects")
	.filter({
		$or: [
			{ textField: { $regex: pattern } },
			{ arrayField: contents },
			{ anotherField: moreContents },
		],
	})
	.get();
```

##### Referring to Single Docs

```javascript
const doc = await db.collection("projects").doc(id).get(); // { exists: boolean, ref, data: () => data, id: string }

if (doc.exists) {
	const data = doc.data();
	const ref = doc.ref; // Will come in handy further
}
```

Or you can use the simpler method:

```javascript
const ref = db.doc(`projects/${id}`); // { get, update, set, delete }
const doc = await ref.get(); // { exists: boolean, ref, data: () => data, id: string }
```

##### Limits and Offsets

```javascript
await db.collection("projects"). ... .limit(1000).offset(500).get();
```

##### Sorting of results

```javascript
await db.collection("projects"). ... .orderBy("fieldToSortBy", "asc" | "desc");
```

---

### Setting/Creating Data

Once you have a doc ref, you can create a new entry for it.

```javascript
const docRef = db.collection("projects").doc();
// or
const docRef = db.collection("projects").doc("your-own-id");

await docRef.set({ field: value }); // Overwrites existing document with the same id.
await docRef.set({ field: value }, { merge: true }); // Overwrites only the fields specified in case a doc with the id already exists.
```

---

### Updating Data

```javascript
await docRef.update({ field: updatedValue });

nonExistentDocRef.update({ field: updatedValue }).catch((err) => {
	console.log(err.message);
	console.log(err.statusCode);
});
```

---

### Deleting Data

```javascript
await docRef.delete();

nonExistentDocRef.delete().catch((err) => {
	console.log(err.message);
	console.log(err.statusCode);
});
```

### Counting Data

```javascript
const { count } = await db
	.collection("projects")
	.where(field, "==", value)
	.count();

const { count } = await db
	.collection("projects")
	.filters({ [field]: { $gte: value } })
	.count();
```

### Adding custom headers to requests

You would obviously want some level of control and most of the times it will be based on cookies or tokens sent via headers.

At the time of initialization:

```javascript
const db = new DB(BACKEND_MONGODB_ENDPOINT, {
	headers: {
		Authorization: token,
	},
});

// or

const db = new DB(BACKEND_MONGODB_ENDPOINT, ({
	operation,
	collectionName,
	id,
	filters,
	newData,
	limit,
	offset,
	merge,
	sortBy,
	sortOrder
}) => {
	// Compute your headers based on the information.
	return { headers: ... }
});
```

---

### Transactions

As long as your [backend MongoDB setup supports Transactions](https://github.com/deve-sh/MBlaze/tree/main/library/express#transactions), you can run them using the `db.runTransaction` method.

> **Only write operations are supported for transactions. Read operations are not atomic/guaranteed because the first time the backend is informed of a transaction, it's when `transaction.save` is called.**

```javascript
db.runTransaction((transaction) => {
	transaction.update(docRef, { newField: "value" });
	transaction.delete(docToDeleteRef);
	transaction.set(docToCreateRef, { newDoc: "newValue" });

	transaction.save(); // Mandatory, otherwise the transaction is never registered.
});
```

### Field Values

MBlaze Client SDK supports Firestore-like Field Value operations.

```javascript
import { FieldValue } from "mblaze.client";

db.collection("projects")
	.doc("project1")
	.update({
		timestamp: FieldValue.serverTimestamp(),
		arrayField: FieldValue.arrayUnion(15),
		arrayFieldToBeRemovedFrom: FieldValue.arrayRemove(5),
		nVisits: FieldValue.increment(10),
		fieldToDelete: FieldValue.delete(),
	});
```

### Fallback URL

In case you have multiple services that can address your MongoDB cluster in the backend, you can specify a `fallbackURL` property for the client SDK to automatically fall back on in case the primary backend URL fails to provide a response. It could happen due to any number of reasons.

```javascript
const db = new DB(BACKEND_MONGODB_ENDPOINT, {
	fallbackURL: BACKEND_FALLBACK_MONGODB_ENDPOINT,
});
```
