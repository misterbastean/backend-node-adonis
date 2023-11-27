// Define an environment named "local"
env "local" {
  // Directory for the migrations
  dir = "file://migrations"

  // Declare where the schema definition resides.
  // Also supported: ["file://multi.hcl", "file://schema.hcl"].
  src = "file://schema.hcl"

  // Define the URL of the database which is managed
  // in this environment.
  url = "sqlite://data.db?_fk=1"

  // Define the URL of the Dev Database for this environment
  // See: https://atlasgo.io/concepts/dev-database
  dev = "sqlite://file?mode=memory&_fk=1"
}

// Define an environment named "test"
env "test" {
  // Directory for the migrations
  dir = "file://migrations"

  // Declare where the schema definition resides.
  // Also supported: ["file://multi.hcl", "file://schema.hcl"].
  src = "file://schema.hcl"

  // Define the URL of the database which is managed
  // in this environment.
  url = "sqlite://test.db?_fk=1"

  // Define the URL of the Dev Database for this environment
  // See: https://atlasgo.io/concepts/dev-database
  dev = "sqlite://file?mode=memory&_fk=1"
}
