# MBlaze - Client Library

JavaScript library to connect to your express app's MongoDB driver.

#### Before Getting Started

Make sure you have the express middleware library installed and setup on your Express app using the [steps here](../express/README.md).

### Setup and Usage

```bash
npm i --save mblaze.client
# or
yarn add mblaze.client
```

```javascript
import DB from "mblaze.client";

const { BACKEND_MONGODB_ROUTE } = process.env;
const db = new DB(BACKEND_MONGODB_ROUTE); // This is your global mblaze instance
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
});
```

---

### Deleting Data

```javascript
await docRef.delete();

nonExistentDocRef.delete().catch((err) => {
	console.log(err.message);
});
```
