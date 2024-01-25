import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { createUnauthorizedError } from "App/Utils/createResponse"

export default class RequireAuth {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { user, params } = ctx
    if (!user || (!user.roles.includes("admin") && params.userId !== user.id)) {
      return ctx.response.json(createUnauthorizedError(ctx))
    }
    await next()
  }
}
