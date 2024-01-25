import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { createUnauthorizedError } from "App/Utils/createResponse"

export default class RequireAdmin {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { user } = ctx
    if (!user || !user.roles.includes("admin")) {
      return ctx.response.json(createUnauthorizedError(ctx))
    }
    await next()
  }
}
