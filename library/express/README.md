# MBlaze - Express

This package is a middleware supposed to be used in Tandem with Client Side MBlaze SDKs, together, they are supposed to make MongoDB-based development much more like Firestore.

<p align="center"><img src="https://raw.githubusercontent.com/deve-sh/MBlaze/main/docs/Express%20Middleware%20Usage.png" style="max-width: 75%;" /></p>

Sets up a single route (A lot like a GraphQL server) on your server, usually at `/mongodb` responsible for handling calls from the client SDK for CRUD operations.

**Note**: There is a peer dependency of `mongodb`, so make sure you have version `>=4.9.0` installed in your express project before using the middleware.

### Setting Up and Usage

```bash
npm i --save mblaze.express mongodb

# or

yarn add mblaze.express mongodb
```

```javascript
const { default: mongodbRouteHandler } = require("mblaze.express");
// or
import mongodbRouteHandler from "mblaze.express";

const { MongoClient } = require("mongodb");

new MongoClient(process.env.MONGODB_URI).connect((err, client) => {
	if (err) throw err;
	const db = client.db(process.env.MONGODB_DBNAME);
	// or whatever route you need the op handler on.
	app.use("/mongodb", mongodbRouteHandler(db));
});
```

Once the Express middleware setup is done, start your server and go to the client, follow the [steps here](../client/README.md) to connect your client app to the MongoDB op handler.

### API Route Documentation

The Postman Collection with examples for all currently supported operations can be found [here](https://documenter.getpostman.com/view/15937596/2s7YYpfmEP).

### Using Mongoose

If you're not using `mongodb` directly and instead using `mongoose` for your operations already in your project, you can retreive the `db` instance from the mongoose connection object.

```javascript
await mongoose.connect(...);
const db = mongoose.connection.db;

app.use("/mongodb", mongodbRouteHandler(db));
```

**Note:** Make sure the connection is already established before extracting, otherwise the value of `db` would be `undefined`.

### Security Rules

You can specify security rules for your collections while instantiating the route handler.

```javascript
app.use("/mongodb", mongodbRouteHandler(db, securityRules));
```

The Security Rules take the form of an object with the following structure:

```typescript
SecuityRulesObject = {
    read: boolean | (Async)Function;    // get or list
    write: boolean | (Async)Function;   // create or update or delete

    // Or more granular
    get: boolean | (Async)Function;
    list: boolean | (Async)Function;
    create: boolean | (Async)Function;
    update: boolean | (Async)Function;
    delete: boolean | (Async)Function;

    // Or even collection-level granular
    [collectionName]: {
        get: boolean | (Async)Function;
        list: boolean | (Async)Function;
        create: boolean | (Async)Function;
        update: boolean | (Async)Function;
        delete: boolean | (Async)Function;
    }
}
```

The precedence order is most granular to least granular.

I.E: For a get operation on the `projects` collection

```javascript
const securityRules = {
	read: true,
	projects: {
		get: false, // This will be considered
	},
};
```

The Function to assess the read takes the following arguments:

```javascript
const securityRuleFunction = (args) => {
    const {
        req,    // The Express request, in case cookies or headers need to be verified
        operation,  // The operation being performed. get | list | create | update| delete
        collection, // The collection the op is being performed on
        id, // Only in case of get, create, update and delete operations
        newResource,    // Data after the document will be modified, only for create and update operations
        resource,   // The currently existing data, only for get, update and delete ops
        filters,    // Only in case of 'list' operations
    } = args;

    return true or false;
}

const securityRules = {
    get: securityRuleFunction,
    list: securityRuleFunction,
    ...
}
```

---

### Transactions

One of the things that makes MongoDB great is transactions.

**Note**: Make sure the MongoDB database you're using has replica sets, MongoDB only supports transactions on replica sets.

To enable transactions with MBlaze, update the initializer statement:

```javascript
// In case of mongoose
await mongoose.connect(...);
const db = mongoose.connection.db;
app.use("/mongodb", mongodbRouteHandler(db, securityRules, mongoose.connection));

// In case of mongodb Node.js driver.
new MongoClient(MONGODB_URI).connect((err, client) => {
    const db = client.db(MONGODB_DBNAME);
    app.use("/mongodb", mongodbRouteHandler(db, securityRules, client));
})
```

Then in order to use transactions for your operations, simply make a request with an array of operations (Only writes supported, except for the read operations that happen internally) instead of a single operation object.

```
POST /mongodb

body: [
    {
        collectionName: 'projects',
        id: 'project1',
        operation: 'delete'
    },
    {
        collectionName: 'tasks',
        id: 'task1',
        operation: 'update',
        newData: {
            'field.nestedField.nestedValue': 'updated_value'
        }
    }
]
```

The above operations will automatically be run as a transaction.
All transaction operations are subject to the same security rules as regular operations.

---

### Features Worth Looking Forward To

- Atomic Array Operations (ArrayUnion and ArrayRemove)
- Server Timestamps
