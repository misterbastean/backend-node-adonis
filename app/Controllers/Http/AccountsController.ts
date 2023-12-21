import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { DateTime } from "luxon"
import { Account } from "App/Models"

export default class AccountsController {
  public async index({ response, params, logger }: HttpContextContract) {
    try {
      const accounts = await Account.query()
        .where("userId", params.user_id)
        .whereNull("deletedAt")

      if (accounts && accounts.length > 0) {
        logger.debug(accounts, "Found accounts")
        return { code: 200, data: accounts }
      } else {
        logger.info(`No accounts found for User with ID of ${params.user_id}`)
        response.status(404)
        return {
          code: 404,
          data: null,
        }
      }
    } catch (err) {
      logger.error({ err }, "Account index")
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
      logger.debug(data, "Create account request data")
      const account = await Account.create(data)
      logger.debug(account, "Created account")
      response.status(201)
      return {
        code: 201,
        data: {
          id: account.id,
        },
      }
    } catch (err) {
      logger.error({ err }, "Account store")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
    }
  }

  public async show({ params, response, logger }: HttpContextContract) {
    try {
      const { user_id: userId, id: accountId } = params
      logger.debug(params, "Request params")

      const account = await Account.query()
        .where("id", accountId)
        .where("userId", userId)
        .whereNull("deletedAt")
        .first()
      if (!account) {
        logger.info(
          `Account not found for User with ID of ${userId} and Account with id of ${accountId}`,
        )
        response.status(404)
        return {
          code: 404,
          data: {
            id: null,
          },
        }
      }
      logger.debug(account, "Found account:")
      return {
        code: 200,
        data: account,
      }
    } catch (err) {
      logger.error({ err }, "Account show")
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
      const { user_id: userId, id: accountId } = params
      logger.debug(params, "Request params")
      const data = request.body().data
      logger.debug(data, "Request data")

      const account = await Account.query()
        .where("id", accountId)
        .where("userId", userId)
        .first()

      if (!account) {
        logger.info(
          `Account not found for User with ID of ${userId} and Account with ID of ${accountId}`,
        )
        response.status(404)
        return {
          code: 404,
          data: {
            id: null,
          },
        }
      }

      account.merge(data)

      await account.save()
      logger.debug(account, "Updated account:")

      return {
        code: 200,
        data: {
          id: account.id,
        },
      }
    } catch (err) {
      logger.error({ err }, "Account update")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
    }
  }

  public async destroy({ params, response, logger }: HttpContextContract) {
    try {
      const { user_id: userId, id: accountId } = params
      logger.debug(params, "Request params:")
      const account = await Account.query()
        .where("id", accountId)
        .where("userId", userId)
        .whereNull("deletedAt")
        .first()

      if (!account) {
        logger.info(
          `No Account found for User with ID of ${userId} and Account with ID of ${accountId}`,
        )
        response.status(404)
        return {
          code: 404,
          data: {
            id: null,
          },
        }
      }

      account.deletedAt = DateTime.now().toISO()
      await account.save()

      return {
        code: 200,
        data: {
          id: account.id,
        },
      }
    } catch (err) {
      logger.error({ err }, "Account destroy")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
    }
  }
}
