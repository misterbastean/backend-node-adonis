import Route from "@ioc:Adonis/Core/Route";

export default function accountRoutes() {
  Route.group(() => {
    Route.resource("acct", "AccountsController");
  }).prefix("/user/:userId");
}
