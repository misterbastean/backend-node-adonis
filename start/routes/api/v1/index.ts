import Route from "@ioc:Adonis/Core/Route";
import userRoutes from "./user";
import accountRoutes from "./account";
import transactionRoutes from "./transaction";

Route.group(() => {
  Route.group(() => {
    userRoutes();
    accountRoutes();
    transactionRoutes();
  })
    .prefix("/v1")
    .as("v1");
})
  .prefix("/api")
  .as("api");
