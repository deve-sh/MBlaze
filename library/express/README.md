# MBlaze - Express

This package is a middleware supposed to be used in Tandem with Client Side MBlaze SDKs, together, they are supposed to make MongoDB-based development much more like Firestore.

<p align="center"><img src="https://raw.githubusercontent.com/deve-sh/MBlaze/main/docs/Express%20Middleware%20Usage.png" style="max-width: 75%;" /></p>

Sets up a single route (A lot like a GraphQL server) on your server, usually at `/mongodb` responsible for handling calls from the client SDK for CRUD operations.

**Note**: There is a peer dependency of `mongodb`, so make sure you have version >=4.9.0 installed in your express project before using the middleware.

#### API Route Documentation

The Postman Collection with examples for all currently supported operations can be found [here](https://documenter.getpostman.com/view/15937596/2s7YYpfmEP).

#### Using Mongoose

If you're not using `mongodb` directly and instead using `mongoose` for your operations already in your project, you can retreive the `db` instance from the mongoose connection object.

```javascript
await mongoose.connect(...);
const db = mongoose.connection.db;

app.use("/mongodb", mongodbRouteHandler(db));
```

**Note:** Make sure the connection is already established before extracting, otherwise the value of `db` would be `undefined`.
