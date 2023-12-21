import { DateTime } from "luxon"
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { User } from "App/Models"

export default class UsersController {
  public async index({ response, logger }: HttpContextContract) {
    try {
      const users = await User.all()
      logger.debug(users, "Found users")
      return { code: 200, data: users }
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
      // TODO: Hash/salt password

      const user = await User.create(data)
      logger.debug(user, "Created user")
      response.status(201)
      return {
        code: 201,
        data: {
          id: user.id,
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
      const user = await User.find(params.id)
      if (user) {
        logger.debug(user, "Found user:")
        return {
          code: 200,
          data: user,
        }
      } else {
        logger.info(`No user found with ID ${params.id}`)
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
      const user = await User.find(params.id)
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
            id: user.id,
          },
        }
      } else {
        logger.info(`User not found with ID of ${params.id}`)
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
      const user = await User.find(params.id)
      logger.debug(user, "Found user:")
      if (user) {
        user.deletedAt = DateTime.now().toISO()
        await user.save()
        return {
          code: 200,
          data: {
            id: user.id,
          },
        }
      } else {
        logger.info(`User not found with ID of ${params.id}`)
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

  public async auth({ request }: HttpContextContract) {
    return {
      message: "Authorize user",
      body: request.body(),
    }
  }
}
