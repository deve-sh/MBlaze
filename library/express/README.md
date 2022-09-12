# MBlaze - Express

This package is a middleware supposed to be used in Tandem with Client Side MBlaze SDKs, together, they are supposed to make MongoDB-based development much more like Firestore.

<p align="center"><img src="https://raw.githubusercontent.com/deve-sh/MBlaze/main/docs/Express%20Middleware%20Usage.png?token=GHSAT0AAAAAABLOK465GGSLYB6WU2QS3GBWYY7IDGA" style="max-width: 75%;" /></p>

Sets up a single route (A lot like a GraphQL server) on your server, usually at `/mongodb` responsible for handling calls from the client SDK for CRUD operations.

The Postman Collection with examples for all currently supported operations can be found [here](https://documenter.getpostman.com/view/15937596/2s7YYpfmEP).
