import type { ApplicationContract } from "@ioc:Adonis/Core/Application"
import Env from "@ioc:Adonis/Core/Env"
import { Role } from "App/Models/User"
import jwt from "jsonwebtoken"

type BearerTokenBody = {
  iss: string
  iat: number
  exp: number
  sub: string
  user: {
    userName: string
    firstName: string
    lastName: string
    email: string
  }
  roles: Role[]
}

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    const JWT_SECRET = Env.get("JWT_SECRET")
    const Route = this.app.container.use("Adonis/Core/Route")

    Route.RouteGroup.macro("withUser", function () {
      this.middleware(async (ctx, next) => {
        try {
          const bearerToken = ctx.request.header("authorization")
          if (bearerToken) {
            const token = bearerToken.replace("Bearer ", "")
            const payload = (await jwt.verify(
              token,
              JWT_SECRET,
            )) as BearerTokenBody

            if (payload && Date.now() < payload.exp * 1000) {
              ctx.user = {
                id: payload.sub,
                roles: payload.roles,
                userName: payload.user.userName,
                firstName: payload.user.firstName,
                lastName: payload.user.lastName,
                email: payload.user.email,
              }
            }
          }
        } catch (err) {
          console.error("Error populating user:")
          console.error(err)
        } finally {
          await next()
        }
      })
      return this
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
