import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

export default class RequireAdmin {
  public async handle(
    { user, response }: HttpContextContract,
    next: () => Promise<void>,
  ) {
    if (!user || !user.roles.includes("admin")) {
      response.unauthorized({
        code: 401,
        error: "Unauthorized",
      })
      return
    }
    await next()
  }
}
