import Route from "@ioc:Adonis/Core/Route";

export default function transactionRoutes() {
  Route.group(() => {
    Route.resource("txn", "TransactionsController");
  }).prefix("/user/:userId/acct/:accountId");
}
