# Northcoders News API
Northcoders News API is a project that mimics a real world backend service, such as Reddit, which can access application data programmatically and provide it to front end architecture.

[View Hosted API](https://nc-news-97rk.onrender.com)

## Getting Started
### Prerequisites
* Postgresql (16.1)
* Node.js (v21)

## Installation
1. Clone the repo:
```
git clone https://github.com/TaylorJBrooks/nc_news_backend.git
```
2. Install all dependencies using npm:
```
npm install
```
3. Setup enviroment variables:

This project uses two databases: one for dev data and the other for test data. 
You will need to create two .env files for this repo: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).

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

### Run Tests
To run all tests in repo: ```npm t```

To run the utils test: ```npm t utils```

To run the app tests: ```npm t app```
