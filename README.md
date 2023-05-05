# MBlaze

A simple library aiming to make working with MongoDB from the frontend simple and elegant, just like [FireStore](https://github.com/firebase/firebase-js-sdk).

### A simple overview of what MBlaze does

![MBlaze Process](docs/MBlaze%20Thought.png)

### Features

- CRUD operations
- Transactions Support
- Granular to the core Security Rules
- Advanced Filtering Mechanisms for Read Operations (Those fulltext-search problems are a thing of the past)
- Client Library that mimics the syntax of [Firestore's Client SDK](https://github.com/firebase/firebase-js-sdk).
- Both Backend and Client libraries fully typed.
- FireStore like `ArrayUnion`, `ArrayRemove`, `Atomic increment`, `serverTimestamp` data types and field `delete` operations.

### Setup

All it takes to setup are a few steps.

> **Currently only Express and Web Clients Are Supported**

- [Setting Up Your Express App with MBlaze](library/express/README.md)
- [Connecting Your Frontend App](library/express/README.md)

### Good to Have

Some good features that Firestore's SDK supports can find their way into MBlaze.

If you would like to contribute, feel free to fork the repo and raise a Pull Request for your feature.
