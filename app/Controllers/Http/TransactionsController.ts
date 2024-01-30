import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { DateTime } from "luxon"
import Transaction from "App/Models/Transaction"
import { formatDateTimeToISO } from "App/Utils"
import {
  createTranactionRequestSchema,
  updateTransactionRequestSchema,
} from "App/Types/Validators/requestsValidators"
import {
  createDeletedResponse,
  createErrorOrResponse,
  createNotFoundError,
} from "App/Utils/createResponse"

export default class TransactionsController {
  public async index(ctx: HttpContextContract) {
    const { params, logger } = ctx
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
        return createErrorOrResponse(ctx, 200, transactions)
      } else {
        logger.info(
          `No transactions found for User ID ${userId}, Account ID ${accountId}`,
        )
        return createNotFoundError(ctx)
      }
    } catch (err) {
      logger.error({ err }, "Transaction index")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async store(ctx: HttpContextContract) {
    const { response, logger } = ctx
    try {
      const data = ctx.request.body().data

      // Validate data
      const validator = await createTranactionRequestSchema.validate(data)
      if (validator.error)
        return createErrorOrResponse(
          ctx,
          400,
          `${validator.error}, ${JSON.stringify(data)}`,
        )

      logger.debug(data, "Transaction store request data")

      // TODO: fix this crap
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const prunedData = (({ availableAmount: _, ...rest }) => rest)(data)

      const transaction = await Transaction.create(prunedData)
      logger.debug(transaction, "Created transaction")
      response.status(201)
      return createErrorOrResponse(ctx, 201, transaction)
    } catch (err) {
      logger.error({ err }, "Transaction store")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async show(ctx: HttpContextContract) {
    const { params, logger } = ctx
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
        return createNotFoundError(ctx)
      }

      delete transaction.$attributes.deletedAt

      return createErrorOrResponse(ctx, 200, transaction)
    } catch (err) {
      logger.error({ err }, "Transaction show")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async update(ctx: HttpContextContract) {
    const { params, request, logger } = ctx
    try {
      const { userId, accountId, transactionId } = params
      logger.debug(params, "Transaction update params")
      const data = request.body().data

      // Validate data
      const validator = await updateTransactionRequestSchema.validate(data)
      if (validator.error)
        return createErrorOrResponse(
          ctx,
          400,
          `${validator.error}, ${JSON.stringify(data)}`,
        )

      logger.debug(data, "Transaction update data")

      // TODO: Fix this crap
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const prunedData = (({ availableAmount: _, ...rest }) => rest)(data)

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
        return createNotFoundError(ctx)
      }

      transaction.merge(prunedData)

      await transaction.save()
      logger.debug(transaction, "Updated transaction")

      return createErrorOrResponse(ctx, 200, transaction)
    } catch (err) {
      logger.error({ err }, "Transaction update")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async destroy(ctx: HttpContextContract) {
    const { params, logger } = ctx
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
        return createNotFoundError(ctx)
      }

      transaction.deletedAt = formatDateTimeToISO(DateTime.local())
      await transaction.save()

      return createDeletedResponse(ctx, transaction)
    } catch (err) {
      logger.error({ err }, "Transaction destroy")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }
}
