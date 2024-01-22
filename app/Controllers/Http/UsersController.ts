import { DateTime } from "luxon"
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { User } from "App/Models"
import { formatDateTimeToISO } from "App/Utils"

export default class UsersController {
  public async index({ response, logger }: HttpContextContract) {
    try {
      const users = await User.query()
        .from("user")
        .select(
          "id",
          "userName",
          "firstName",
          "lastName",
          "email",
          "createdAt",
          "updatedAt",
          "deletedAt",
        )
      logger.debug(users, "Found users")
      const prunedUsers = users.map((user) => {
        delete user.$attributes.deletedAt
        return user
      })

      return { code: 200, data: prunedUsers }
    } catch (err) {
      logger.error({ err }, "User index")
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
      logger.debug(data, "Received data")

      // TODO: Validate incoming data

      const user = await User.create({ ...data, role: "user" })
      logger.debug(user, "Created user")
      response.status(201)
      return {
        code: 201,
        data: {
          ...user.$attributes,
          password: undefined,
        },
      }
    } catch (err) {
      logger.error({ err }, "User store")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
    }
  }

  public async show({ params, response, logger }: HttpContextContract) {
    try {
      const user = await User.query()
        .from("user")
        .select(
          "id",
          "userName",
          "firstName",
          "lastName",
          "email",
          "createdAt",
          "updatedAt",
          "deletedAt",
        )
        .where("id", params.userId)
        .first()

      // Cannot check if deletedAt is null during DB query due to luxom formatting issues
      // with how the SQLite DB value is stored.
      if (user && !user.deletedAt) {
        delete user.$attributes.deletedAt
        return {
          code: 200,
          data: user,
        }
      } else {
        logger.info(`No user found with ID ${params.userId}`)
        response.status(404)
        return {
          code: 404,
          data: null,
        }
      }
    } catch (err) {
      logger.error({ err }, "User show")
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
      const user = await User.find(params.userId)
      logger.debug(user, "Found user")
      if (user) {
        const data = request.body().data
        logger.debug(data, "Request data:")

        // TODO: Validate data

        user.merge(data)
        await user.save()
        logger.debug(user, "Updated user:")
        return {
          code: 200,
          data: {
            ...user.$attributes,
            password: undefined,
            deletedAt: undefined,
          },
        }
      } else {
        logger.info(`User not found with ID of ${params.userId}`)
        response.status(404)
        return {
          code: 404,
          data: null,
        }
      }
    } catch (err) {
      logger.error({ err }, "User update")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
    }
  }

  public async destroy({ params, response, logger }: HttpContextContract) {
    try {
      const user = await User.find(params.userId)
      logger.debug(user, "Found user:")
      if (user) {
        user.deletedAt = formatDateTimeToISO(DateTime.local())
        await user.save()
        return {
          code: 200,
          data: {
            id: user.id,
          },
        }
      } else {
        logger.info(`User not found with ID of ${params.userId}`)
        response.status(404)
        return {
          code: 404,
          data: null,
        }
      }
    } catch (err) {
      logger.error({ err }, "User destroy")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
    }
  }

  public async login() {
    return {
      code: 200,
      data: {
        success: true,
      },
    }
  }

  public async logout() {
    return {
      code: 200,
      data: {
        success: true,
      },
    }
  }
}
