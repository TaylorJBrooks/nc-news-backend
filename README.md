# Northcoders News API

Northcoders News API is a project that serves as the backend for the Northcoders News front-end application, providing access to various endpoints for articles, comments, users and topics.

The API is built using Node.js and Express.js, with PostgreSQl serving as the database for storing data. It follows RESTful principles and returns data in JSON format.

## Live Demo

You can access the live demo of the API hosted on Render [here](https://nc-news-97rk.onrender.com/api).

## Endpoints

The API provides the following endpoints:

- `/api/articles`: Allows users to retrieve a list of articles, post a new article, or search for articles by query.
- `/api/articles/:article_id`: Allows users to retrieve a specific article by its ID, update an article's votes, or delete an article.
- `/api/articles/:article_id/comments`: Allows users to retrieve comments for a specific article or post a new comment.
- `/api/comments/:comment_id`: Allows users to update a comment's votes, or delete a comment.
- `/api/topics`: Allows users to retrieve a list of topics or post a new topic.
- `/api/users`: Allows users to retrieve a list of users.
- `/api/users/:username`: Allows users to retrieve a specific user by their username.

## Getting Started
### Prerequisites
* Postgresql (16.1)
* Node.js (v21)

## Installation

To run this project locally, follow these steps:

1. Clone the repo:

```
git clone https://github.com/TaylorJBrooks/nc-news-backend.git
```


2. Navigate to the project directory:

```
cd nc-news-backend
```


3. Install all dependencies using npm:

```
npm install
```

3. Setup enviroment variables:

This project uses two databases: one for dev data and the other for test data. 
You will need to create two .env files for this repo: `.env.test` and `.env.development`. Into each, add `PGDATABASE=`, with the correct database name for that environment (see /db/setup.sql for the database names).

4. Setup databases:
```
npm run setup-dbs
```

### Seed Databases
To seed development database:
```
npm run seed
```
The test database does not need to be manually seeded as it is seeded when tests are run.

### Testing
To run all tests in repo: ```npm t```

To run the utils test: ```npm t utils```

To run the app tests: ```npm t app```

This project utilizes the Jest testing framework along with Supertest to test endpoints and routes on HTTP servers.

## Dependencies

This project utilizes the following major dependencies:

- Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- Express.js: A minimalist web framework for Node.js.
- Body-parser: Node.js body parsing middleware, used to parse incoming request bodies.
- Cors: Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- Dotenv: A zero-dependency module that loads environment variables from a .env file into process.env.
- Jest: A JavaScript test framework running on Node.js.
- Supertest: A high-level abstraction for testing HTTP, similar to Superagent, but specifically for testing HTTP servers.
