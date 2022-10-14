# Awais House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Our database will be PSQL, and we will interact with it using [node-postgres](https://node-postgres.com/).

The app built here has several end points that could be seen on the api homepage, [API homepage](https://awais-game-data.herokuapp.com/api). The endpoints also describe their functionality, their input and output examples, and if it supports any quieries.

## Heroku App

The live version of the app where you can see the app running in a real world scenario, the /api will show you the endpoints and queries avaiable on this app. You can find the link down below:

Link to my live app: https://awais-game-data.herokuapp.com/api

# Your Setup

## Dependenices

In order to make the project efficient we employ some packages and dependencies.

Jest is used for JavaScript testing solution. Provides feedback fo failed tests.

- [jest](https://www.npmjs.com/package/jest)

Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env

- [dotenv](https://www.npmjs.com/package/dotenv)

pg is a non-blocking PostgreSQL client for Node.js.

- [pg](https://www.npmjs.com/package/pg)

Express is a fast, unopinionated, minimalist web framework for Node.js.

- [express](https://www.npmjs.com/package/express)

pg-format is used for safely creating dynamic SQL queries. Moreover, SQL identifiers and literals are escaped to help prevent SQL injection.

- [pg-format](https://www.npmjs.com/package/pg-format)

jest-sorted extends jest.expect with 2 custom matchers, toBeSorted and toBeSortedBy

- [jest-sorted](https://www.npmjs.com/package/jest-sorted)

supertest provides a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent.

- [supertest](https://link-url-here.org)

You can install these dependecies using npm install or simply npm i _/your-package-name/_. You can also make use of -D flag if you want to make it a Dev Dependecy.

## Database setup and seeding

In order to set up the database for the project, we use the scripts in our package.json file. In order to set up the databases, both for debvelopmet and test data, we run the setup-dbs script using _/npm run setup-dbs/_.

Once the databases are setup we can use the seed file to insert the data into our database. For that to work we use the seed script on the packages.json by running _/npm run seed/_ in the terminal. This command will insert the data in various tables of our database.

## .env Files

In order to work on the project, you would have to create environment variables. An environment variable is a dynamic-named value that can affect the way running processes will behave.

For this project you will need to setup _.env.test_ and _.env.development_. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names).

In the end, add the environment variables to the .gitignore file either by naming all of the varibales or using .env.\* to add all of them at once, useful in case of many environment variables.

## Minimum Versions

Node: 8.13._\*_

pg: 8.7._\*_

## Running Tests

The project contains to test files which you can find in the test folder, namely, endpoints.test.js and utils.test.js. The first one makes sure that the endpoints we created run in the required manner and give the right results, while at the same time handle different error scenarios. The later one makes sure the utils.js does its required task in the right manner when we need to insert the data into our databases.

To run the test, we will make use of npm test or for shorthand npm t, and providing the path to either of the test, not providing any path will run both the files and all the test suited contained in both the files.

You could also make use of .only if you want to see a spcific test suite or even a specific test in action. All you have to do is put .only in front of the describe or test block in question.
