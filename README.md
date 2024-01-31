# Bench Dashboard - Backend (Node AdonisJS)

This is a Node.js implementation of the Bench Dashboard backend, using the [AdonisJS framework](https://adonisjs.com/). \*Note that this uses AdonisJS [v5](https://v5-docs.adonisjs.com/guides/introduction), not v6 which was just released.

## Prerequisites

1. Make sure you have `pnpm` [installed](https://pnpm.io/installation).
2. You will also need an SQLite database. The best way to get started with that would be to clone the Bench Project `data` [repo](https://bitbucket.endava.com/projects/BDAP/repos/data/browse), then follow its instructions to create the DB and run migrations, then seed it.

## Installation

1. Clone this repo and run `pnpm install` from the root.
2. Create a `.env` file in the root and copy from the `.env.example`, then update as needed.

## Running

To run in dev mode, just use `pnpm run dev`. This will start the server on the HOST:PORT specified in the `.env`.

## Testing

To run tests, you can just use `pnpm run test`. If you want a coverage report, run `pnpm run coverage` and a report will be created in `/tests/coverage/index.html`
