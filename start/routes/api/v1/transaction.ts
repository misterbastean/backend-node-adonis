import Route from "@ioc:Adonis/Core/Route";

export default function transactionRoutes() {
  Route.group(() => {
    Route.get("/", "TransactionsController.index").as("index");

    Route.post("/", "TransactionsController.store").as("store");

    Route.delete("/:transactionId", "TransactionsController.destroy").as(
      "destroy"
    );

    Route.get("/:transactionId", "TransactionsController.show").as("show");

    Route.put("/:transactionId", "TransactionsController.update").as("update");
  })
    .as("transaction")
    .prefix("/user/:userId/acct/:accountId/txn");
}
