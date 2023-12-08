import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { DateTime } from "luxon";
import Transaction from "@Models/Transaction";
import { v4 as uuidv4 } from "uuid";

export default class TransactionsController {
  public async index({ response, params }: HttpContextContract) {
    try {
      const { user_id: userId, account_id: accountId } = params;
      const transactions = await Transaction.query()
        .where("userId", userId)
        .where("accountId", accountId)
        .whereNull("deletedAt");

      if (transactions && transactions.length > 0) {
        return { code: 200, data: transactions };
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
      const transaction = await Transaction.create({ id, ...data });
      response.status(201);
      return {
        code: 201,
        data: {
          id: transaction.id,
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
      const {
        user_id: userId,
        account_id: accountId,
        id: transactionId,
      } = params;

      const transaction = await Transaction.query()
        .where("id", transactionId)
        .where("userId", userId)
        .where("accountId", accountId)
        .whereNull("deletedAt")
        .first();
      if (!transaction) {
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
        data: transaction,
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
      const {
        user_id: userId,
        account_id: accountId,
        id: transactionId,
      } = params;
      const data = request.body().data;

      const transaction = await Transaction.query()
        .where("id", transactionId)
        .where("accountId", accountId)
        .where("userId", userId)
        .first();

      if (!transaction) {
        response.status(404);
        return {
          code: 404,
          data: {
            id: null,
          },
        };
      }

      transaction.merge(data);

      await transaction.save();

      return {
        code: 200,
        data: {
          id: transaction.id,
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
      const {
        user_id: userId,
        account_id: accountId,
        id: transactionId,
      } = params;
      let transaction = await Transaction.query()
        .where("id", transactionId)
        .where("accountId", accountId)
        .where("userId", userId)
        .whereNull("deletedAt")
        .first();

      if (!transaction) {
        response.status(404);
        return {
          code: 404,
          data: {
            id: null,
          },
        };
      }

      transaction.deletedAt = DateTime.now().toISO();
      await transaction.save();

      return {
        code: 200,
        data: {
          id: transaction.id,
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
