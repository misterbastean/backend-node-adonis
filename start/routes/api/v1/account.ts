import Route from "@ioc:Adonis/Core/Route";

export default function accountRoutes() {
  Route.group(() => {
    Route.get("/", "AccountsController.index").as("index");

    Route.post("/", "AccountsController.store").as("store");

    Route.delete("/:accountId", "AccountsController.destroy").as("destroy");

    Route.get("/:accountId", "AccountsController.show").as("show");

    Route.put("/:accountId", "AccountsController.update").as("update");
  })
    .as("account")
    .prefix("/user/:userId/acct");
}
