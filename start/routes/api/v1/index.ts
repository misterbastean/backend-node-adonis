import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.resource("user", "UsersController").apiOnly();
  Route.post("/auth", "UsersController.auth").prefix("user").as("user.auth");
  Route.resource("user.account", "AccountsController").apiOnly();
  Route.resource(
    "user.account.transaction",
    "TransactionsController"
  ).apiOnly();
})
  .as("api.v1")
  .prefix("/api/v1");
