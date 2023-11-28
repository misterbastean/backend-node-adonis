import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Account from "../../Models/Account";

export default class AccountsController {
  public async index({ response, params }: HttpContextContract) {
    try {
      const accounts = await Account.query().where("userId", params.user_id);

      if (accounts && accounts.length > 0) {
        return { code: 0, data: accounts };
      } else {
        response.status(404);
        return {
          code: 0,
          data: null,
        };
      }
    } catch (err) {
      response.status(500);
      console.error(err);
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
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
