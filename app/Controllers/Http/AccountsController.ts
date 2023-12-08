import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import Account from "@Models/Account";

export default class AccountsController {
  public async index({ response, params }: HttpContextContract) {
    try {
      const accounts = await Account.query()
        .where("userId", params.user_id)
        .whereNull("deletedAt");

      if (accounts && accounts.length > 0) {
        return { code: 200, data: accounts };
      } else {
        response.status(404);
        return {
          code: 404,
          data: null,
        };
      }
    } catch (err) {
      response.status(500);
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
      response.status(201);
      return {
        code: 201,
        data: {
          id: account.id,
        },
      };
    } catch (err) {
      response.status(500);
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const { user_id: userId, id: accountId } = params;

      const account = await Account.query()
        .where("id", accountId)
        .where("userId", userId)
        .whereNull("deletedAt")
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
        code: 200,
        data: account,
      };
    } catch (err) {
      response.status(500);
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const { user_id: userId, id: accountId } = params;
      const data = request.body().data;

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

      account.merge(data);

      await account.save();

      return {
        code: 200,
        data: {
          id: account.id,
        },
      };
    } catch (err) {
      response.status(500);
      return {
        code: err.errno || 500,
        error: err.message,
      };
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const { user_id: userId, id: accountId } = params;
      let account = await Account.query()
        .where("id", accountId)
        .where("userId", userId)
        .whereNull("deletedAt")
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

      account.deletedAt = DateTime.now().toISO();
      await account.save();

      return {
        code: 200,
        data: {
          id: account.id,
        },
      };
    } catch (err) {
      response.status(500);
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
  }
}
