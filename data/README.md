# Data

## Installation

Follow the instructions to install atlas at the following... https://atlasgo.io/getting-started

Also, ensure that you have `make` installed. If not, please install it via command-line tools for Mac or through the linux
distro's package manager if on WSL.

## Commands

### To create the db and run migrations

From the root of the project

```
make db-hash db-apply
```

### To seed the db

From the root of the project

```
make db-seed
```

### To reset the db

From the root of the project

```
make db-reset
```

### To create the test db

From the root of the project

```
make db-test
```
