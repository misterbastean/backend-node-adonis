import { DateTime } from "luxon"
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { User } from "App/Models"
import {
  checkPassword,
  createBearerToken,
  formatDateTimeToISO,
} from "App/Utils"
import {
  createDeletedResponse,
  createErrorOrResponse,
  createNotFoundError,
} from "App/Utils/createResponse"
import {
  createUserRequestSchema,
  updateUserRequestSchema,
} from "App/Types/Validators/requestsValidators"

export default class UsersController {
  public async index(ctx: HttpContextContract) {
    const { logger } = ctx
    try {
      const foundUsers = await User.query()
        .from("user")
        .select(
          "id",
          "userName",
          "firstName",
          "lastName",
          "email",
          "createdAt",
          "updatedAt",
        )
        .whereNull("deletedAt")
      logger.debug(foundUsers, "Found users")

      if (!foundUsers || foundUsers.length === 0) {
        return createNotFoundError(ctx)
      }

      return createErrorOrResponse(ctx, 200, foundUsers)
    } catch (err) {
      logger.error({ err }, "User index")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async store(ctx: HttpContextContract) {
    const { request, logger } = ctx
    try {
      const data = request.body().data
      logger.debug(data, "Received data")

      // Validate data
      const validator = await createUserRequestSchema.validate(data)
      if (validator.error)
        return createErrorOrResponse(
          ctx,
          400,
          `${validator.error}, ${JSON.stringify(data)}`,
        )

      const user = await User.create({ ...data, role: "user" })
      logger.debug(user, "Created user")
      return createErrorOrResponse(ctx, 201, user)
    } catch (err) {
      logger.error({ err }, "User store")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async show(ctx: HttpContextContract) {
    const { params, logger } = ctx
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
        return createErrorOrResponse(ctx, 200, user)
      } else {
        logger.info(`No user found with ID ${params.userId}`)
        return createNotFoundError(ctx)
      }
    } catch (err) {
      logger.error({ err }, "User show")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async update(ctx: HttpContextContract) {
    const { params, request, logger } = ctx
    try {
      const user = await User.find(params.userId)
      logger.debug(user, "Found user")
      if (user) {
        const data = request.body().data
        logger.debug(data, "Request data:")

        // Validate data
        const validator = await updateUserRequestSchema.validate(data)
        if (validator.error)
          return createErrorOrResponse(
            ctx,
            400,
            `${validator.error}, ${JSON.stringify(data)}`,
          )

        user.merge(data)
        await user.save()
        logger.debug(user, "Updated user:")
        return createErrorOrResponse(ctx, 200, user)
      } else {
        logger.info(`User not found with ID of ${params.userId}`)
        return createNotFoundError(ctx)
      }
    } catch (err) {
      logger.error({ err }, "User update")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async destroy(ctx: HttpContextContract) {
    const { params, logger } = ctx
    try {
      const user = await User.find(params.userId)
      logger.debug(user, "Found user:")
      if (user) {
        user.deletedAt = formatDateTimeToISO(DateTime.local())
        await user.save()
        return createDeletedResponse(ctx, user)
      } else {
        logger.info(`User not found with ID of ${params.userId}`)
        return createNotFoundError(ctx)
      }
    } catch (err) {
      logger.error({ err }, "User destroy")
      return createErrorOrResponse(ctx, 500, err.message)
    }
  }

  public async login({ request, response, logger }) {
    const invalidLoginResponse = {
      code: 401,
      error: "Invalid username or password",
    }
    try {
      const body = request.body().data

      const user = await User.query()
        .from("user")
        .select(
          "id",
          "userName",
          "password",
          "role",
          "firstName",
          "lastName",
          "email",
        )
        .where("email", body.email)
        .first()

      if (!user) {
        response.status(401)
        return invalidLoginResponse
      }

      const passwordMatches = await checkPassword(user.password, body.password)
      if (!passwordMatches) {
        response.status(401)
        return invalidLoginResponse
      }

      const accessToken = await createBearerToken(user)

      return {
        code: 200,
        data: {
          accessToken,
          tokenType: "Bearer",
          expiresIn: 3600, // 1 hour in seconds
        },
      }
    } catch (err) {
      logger.error({ err }, "User login")
      response.status(500)
      return {
        code: 500,
        error: err.message,
      }
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
