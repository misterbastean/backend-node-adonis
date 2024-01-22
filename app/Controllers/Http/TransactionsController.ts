import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { DateTime } from "luxon"
import Transaction from "App/Models/Transaction"
import { formatDateTimeToISO } from "App/Utils"

export default class TransactionsController {
  public async index({ response, params, logger }: HttpContextContract) {
    try {
      const { userId, accountId } = params
      logger.debug(params, "params:")
      const transactions = await Transaction.query()
        .select([
          "accountId",
          "amount",
          "createdAt",
          "id",
          "merchant",
          "operation",
          "status",
          "transactionTypeId",
          "updatedAt",
          "userId",
        ])
        .where("userId", userId)
        .where("accountId", accountId)
        .whereNull("deletedAt")

      logger.debug(transactions, "Found transactions:")

      if (transactions && transactions.length > 0) {
        return { code: 200, data: transactions }
      } else {
        logger.info(
          `No transactions found for User ID ${userId}, Account ID ${accountId}`,
        )
        response.status(404)
        return {
          code: 404,
          data: null,
        }
      }
    } catch (err) {
      logger.error({ err }, "Transaction index")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
    }
  }

  public async store({ request, response, logger }: HttpContextContract) {
    try {
      const data = request.body().data

      logger.debug(data, "Transaction store request data")
      const transaction = await Transaction.create(data)
      logger.debug(transaction, "Created transaction")
      response.status(201)
      return {
        code: 201,
        data: {
          ...transaction.$attributes,
          createdAt: undefined,
          updatedAt: undefined,
        },
      }
    } catch (err) {
      logger.error({ err }, "Transaction store")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
    }
  }

  public async show({ params, response, logger }: HttpContextContract) {
    try {
      const { userId, accountId, transactionId } = params
      logger.debug(params, "Transaction show params")

      const transaction = await Transaction.query()
        .where("id", transactionId)
        .where("userId", userId)
        .where("accountId", accountId)
        .first()

      logger.debug(transaction, "Found transaction")
      if (!transaction || transaction.deletedAt) {
        logger.info(
          `No transaction found for User ID ${userId}, Account ID ${accountId}, Transaction ID ${transactionId}`,
        )
        response.status(404)
        return {
          code: 404,
          error: "Transaction not found.",
        }
      }

      delete transaction.$attributes.deletedAt

      return {
        code: 200,
        data: transaction,
      }
    } catch (err) {
      logger.error({ err }, "Transaction show")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
    }
  }

  public async update({
    params,
    request,
    response,
    logger,
  }: HttpContextContract) {
    try {
      const { userId, accountId, transactionId } = params
      logger.debug(params, "Transaction update params")
      const data = request.body().data

      logger.debug(data, "Transaction update data")

      const transaction = await Transaction.query()
        .where("id", transactionId)
        .where("accountId", accountId)
        .where("userId", userId)
        .first()
      logger.debug(transaction, "Found transaction")

      if (!transaction) {
        logger.info(
          `No transaction found for User ID ${userId}, Account ID ${accountId}, Transaction ID ${transactionId}`,
        )
        response.status(404)
        return {
          code: 404,
          data: {
            id: null,
          },
        }
      }

      transaction.merge(data)

      await transaction.save()
      logger.debug(transaction, "Updated transaction")

      return {
        code: 200,
        data: {
          ...transaction.$attributes,
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
        },
      }
    } catch (err) {
      logger.error({ err }, "Transaction update")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
    }
  }

  public async destroy({ params, response, logger }: HttpContextContract) {
    try {
      const { userId, accountId, transactionId } = params
      logger.debug(params, "Transaction destroy params")
      const transaction = await Transaction.query()
        .where("id", transactionId)
        .where("accountId", accountId)
        .where("userId", userId)
        .first()
      logger.debug(transaction, "Found transaction")
      if (!transaction || transaction.deletedAt) {
        logger.info(
          `No transaction found for User ID ${userId}, Account ID ${accountId}, Transaction ID ${transactionId}`,
        )
        response.status(404)
        return {
          code: 404,
          data: {
            id: null,
          },
        }
      }

      transaction.deletedAt = formatDateTimeToISO(DateTime.local())
      await transaction.save()

      return {
        code: 200,
        data: {
          id: transaction.id,
        },
      }
    } catch (err) {
      logger.error({ err }, "Transaction destroy")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
    }
  }
}
