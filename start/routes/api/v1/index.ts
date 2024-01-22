import Route from "@ioc:Adonis/Core/Route"

// Route.group(() => {
//   Route.resource("user", "UsersController").apiOnly()
//   Route.post("/login", "UsersController.login").as("user.login")
//   Route.post("/logout", "UsersController.logout").as("user.logout")
//   Route.resource("account", "AccountsController").apiOnly()
//   Route.resource("user.account.transaction", "TransactionsController").apiOnly()
// })
//   .as("api.v1")
//   .prefix("/api/v1")

Route.group(() => {
  // Accounts
  Route.group(() => {
    Route.get("/", "AccountsController.index").as("listAccount")
    Route.post("/", "AccountsController.store").as("createAccount")
    Route.get("/:accountId", "AccountsController.show").as("showAccount")
    Route.put("/:accountId", "AccountsController.update").as("updateAccount")
    Route.delete("/:accountId", "AccountsController.destroy").as(
      "destroyAccount",
    )
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
  // Users
  Route.group(() => {
    Route.get("/", "UsersController.index").as("listUser")
    Route.post("/", "UsersController.store").as("createUser")
    Route.get("/:userId", "UsersController.show").as("showUser")
    Route.put("/:userId", "UsersController.update").as("updateUser")
    Route.delete("/:userId", "UsersController.destroy").as("destroyUser")
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
