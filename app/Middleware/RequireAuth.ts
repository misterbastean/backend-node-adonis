import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

export default class RequireAuth {
  public async handle(
    { user, params, response }: HttpContextContract,
    next: () => Promise<void>,
  ) {
    if (!user || (!user.roles.includes("admin") && params.userId !== user.id)) {
      response.unauthorized({
        code: 401,
        error: "Unauthorized",
      })
      return
    }
    await next()
  }
}
