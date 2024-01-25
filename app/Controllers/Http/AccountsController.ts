import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { DateTime } from "luxon"
import { Account } from "App/Models"
import { formatDateTimeToISO } from "App/Utils"
import {
  createDeletedResponse,
  createErrorOrResponse,
  createNotFoundError,
} from "App/Utils/createResponse"

export default class AccountsController {
  public async index(ctx: HttpContextContract) {
    const { params, logger } = ctx
    try {
      const accounts = await Account.query()
        .select([
          "accountNumber",
          "accountTypeId",
          "amount",
          "availableAmount",
          "createdAt",
          "currencyCode",
          "id",
          "name",
          "routingNumber",
          "updatedAt",
          "userId",
        ])
        .where("userId", params.userId)
        .whereNull("deletedAt")

      if (accounts && accounts.length > 0) {
        return createErrorOrResponse(ctx, 200, accounts)
      } else {
        return createNotFoundError(ctx)
      }
    } catch (err) {
      logger.error({ err }, "Account index")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async store(ctx: HttpContextContract) {
    const { request, logger } = ctx
    try {
      const data = request.body().data
      const account = await Account.create(data)
      return createErrorOrResponse(ctx, 201, account)
    } catch (err) {
      logger.error({ err }, "Account store")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async show(ctx: HttpContextContract) {
    const { params, logger } = ctx
    try {
      const { userId, accountId } = params

      const account = await Account.query()
        .where("id", accountId)
        .where("userId", userId)
        .select(
          "accountNumber",
          "accountTypeId",
          "amount",
          "availableAmount",
          "createdAt",
          "currencyCode",
          "id",
          "name",
          "routingNumber",
          "updatedAt",
          "userId",
          "deletedAt",
        )
        .first()
      if (!account || account.deletedAt) {
        logger.info(
          `Account not found for User with ID of ${userId} and Account with id of ${accountId}`,
        )
        return createNotFoundError(ctx)
      }
      delete account.$attributes["deletedAt"]
      return createErrorOrResponse(ctx, 200, account)
    } catch (err) {
      logger.error({ err }, "Account show")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async update(ctx: HttpContextContract) {
    const { params, request, logger } = ctx
    try {
      const { userId, accountId } = params
      const data = request.body().data

      const account = await Account.query()
        .where("id", accountId)
        .where("userId", userId)
        .first()

      if (!account) {
        logger.info(
          `Account not found for User with ID of ${userId} and Account with ID of ${accountId}`,
        )
        return createNotFoundError(ctx)
      }

      account.merge(data)

      await account.save()

      return createErrorOrResponse(ctx, 200, account)
    } catch (err) {
      logger.error({ err }, "Account update")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async destroy(ctx: HttpContextContract) {
    const { params, logger } = ctx
    try {
      const { userId, accountId } = params
      const account = await Account.query()
        .where("id", accountId)
        .where("userId", userId)
        .first()

      if (!account) {
        logger.info(
          `No Account found for User with ID of ${userId} and Account with ID of ${accountId}`,
        )
        return createNotFoundError(ctx)
      }

      account.deletedAt = formatDateTimeToISO(DateTime.local())
      await account.save()

      return createDeletedResponse(ctx, account)
    } catch (err) {
      logger.error({ err }, "Account destroy")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }
}
