import Route from "@ioc:Adonis/Core/Route";

export default function userRoutes() {
  Route.group(() => {
    Route.resource("user", "UsersController");
  });
  Route.post("/auth", "UsersController.auth").prefix("user").as("auth");
}
