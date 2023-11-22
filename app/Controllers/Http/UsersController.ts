import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UsersController {
  public async index({}: HttpContextContract) {
    return { message: "List all users" };
  }

  public async store({ request }: HttpContextContract) {
    return {
      message: "Create new user",
      body: request.body(),
    };
  }

  public async show({ params }: HttpContextContract) {
    return {
      message: "Show single user",
      params,
    };
  }

  public async update({ params, request }: HttpContextContract) {
    return {
      message: "Update single user",
      params,
      body: request.body(),
    };
  }

  public async destroy({ params }: HttpContextContract) {
    return {
      message: "Destroy single user",
      params,
    };
  }

  public async auth({ request }: HttpContextContract) {
    return {
      message: "Authorize user",
      body: request.body(),
    };
  }
}
