import Route from "@ioc:Adonis/Core/Route";
import userRoutes from "./user";

Route.group(() => {
  Route.group(() => {
    userRoutes();
  })
    .prefix("/v1")
    .as("v1");
})
  .prefix("/api")
  .as("api");
