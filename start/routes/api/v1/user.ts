import Route from "@ioc:Adonis/Core/Route";

export default function userRoutes() {
  Route.group(() => {
    Route.get("/", "UsersController.index").as("index");

    Route.post("/", "UsersController.store").as("store");

    Route.delete("/:userId", "UsersController.destroy").as("destroy");

    Route.get("/:userId", "UsersController.show").as("show");

    Route.put("/:userId", "UsersController.update").as("update");

    Route.post("/auth", "UsersController.auth").as("auth");
  })
    .as("user")
    .prefix("/user");
}
