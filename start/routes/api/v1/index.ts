import Route from "@ioc:Adonis/Core/Route";
import userRoutes from "./user";
import accountRoutes from "./account";

Route.group(() => {
  Route.group(() => {
    userRoutes();
    accountRoutes();
  })
    .prefix("/v1")
    .as("v1");
})
  .prefix("/api")
  .as("api");
