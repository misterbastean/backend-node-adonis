import Route from "@ioc:Adonis/Core/Route"

Route.group(() => {
  // Accounts
  Route.group(() => {
    Route.get("/", "AccountsController.index")
      .as("listAccount")
      .middleware("requiresAuth")
    Route.post("/", "AccountsController.store")
      .as("createAccount")
      .middleware("requiresAuth")
    Route.get("/:accountId", "AccountsController.show")
      .as("showAccount")
      .middleware("requiresAuth")
    Route.put("/:accountId", "AccountsController.update")
      .as("updateAccount")
      .middleware("requiresAuth")
    Route.delete("/:accountId", "AccountsController.destroy")
      .as("destroyAccount")
      .middleware("requiresAuth")
  })
    .as("account")
    .prefix("/account/:userId")

  // Transactions
  Route.group(() => {
    Route.get("/", "TransactionsController.index").as("listTransaction")
    Route.post("/", "TransactionsController.store").as("createTransaction")
    Route.get("/:transactionId", "TransactionsController.show").as(
      "showTransaction",
    )
    Route.put("/:transactionId", "TransactionsController.update").as(
      "updateTransaction",
    )
    Route.delete("/:transactionId", "TransactionsController.destroy").as(
      "destroyTransaction",
    )
  })
    .as("transaction")
    .prefix("/transaction/:userId/:accountId")
    .middleware("requiresAuth")

  // Users
  Route.group(() => {
    Route.get("/", "UsersController.index")
      .as("listUser")
      .middleware("requiresAdmin")
    Route.post("/", "UsersController.store").as("createUser")
    Route.get("/:userId", "UsersController.show")
      .as("showUser")
      .middleware("requiresAuth")
    Route.put("/:userId", "UsersController.update")
      .as("updateUser")
      .middleware("requiresAuth")
    Route.delete("/:userId", "UsersController.destroy")
      .as("destroyUser")
      .middleware("requiresAuth")
  })
    .as("user")
    .prefix("/user")
  // Auth
  Route.group(() => {
    Route.post("/login", "UsersController.login").as("login")
    Route.post("/logout", "UsersController.logout").as("logout")
  })
})
  .as("api.v1")
  .prefix("/api/v1")
  .withUser()
