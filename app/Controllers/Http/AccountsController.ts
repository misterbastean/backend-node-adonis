import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AccountsController {
  public async index({ params }: HttpContextContract) {
    return {
      message: `List all accounts for user with ID of ${params.user_id}`,
    };
  }

  public async store({ params, request }: HttpContextContract) {
    return {
      message: `Create new account for user with ID of ${params.user_id}`,
      body: request.body(),
    };
  }

  public async show({ params }: HttpContextContract) {
    return {
      message: "Show single account",
      params,
    };
  }

  public async update({ params, request }: HttpContextContract) {
    return {
      message: "Update single account",
      params,
      body: request.body(),
    };
  }

  public async destroy({ params }: HttpContextContract) {
    return {
      message: "Destroy single account",
      params,
    };
  }
}
