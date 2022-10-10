# Awais House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Our database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Kanban

### Link to my Trello Board here: https://trello.com/b/CO0DcXU2/be-project-awais

To keep track of the tasks involved in this project we're going to use a kanban board. You can click on the ticket to find out more information about what is required for the feature.

## Husky

To ensure we are not commiting broken code this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package which allows us to set up and maintain these scripts. This project makes use a _pre-commit hook_. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail than the commit will be aborted.

The [Husky documentation](https://typicode.github.io/husky/#/) explains how to configure Husky for your own project as well as creating your own custom hooks.\_

## Your Setup

In order to work on the project, you would have to create environment variables. An environment variable is a dynamic-named value that can affect the way running processes will behave.

For this project you will need to setup _.env.test_ and _.env.development_. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names).

In the end, add the environment variables to the .gitignore file either by naming all of the varibales or using .env.\* to add all of them at once, useful in case of many environment variables.
