import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { v4 as uuidv4 } from "uuid";
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

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.body().data;
      const id = uuidv4();
      const account = await Account.create({ id, ...data });
      return {
        code: 0,
        data: {
          id: account.id,
        },
      };
    } catch (err) {
      response.status(500);
      console.error(err);
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      console.log("params:", params);
      const { user_id: userId, id: accountId } = params;

      const account = await Account.query()
        .where("id", accountId)
        .where("userId", userId)
        .first();
      if (!account) {
        response.status(404);
        return {
          code: 404,
          data: {
            id: null,
          },
        };
      }

      return {
        code: 0,
        data: account,
      };
    } catch (err) {
      response.status(500);
      console.error(err);
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
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
