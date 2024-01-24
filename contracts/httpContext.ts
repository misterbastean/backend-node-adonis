import { Role } from "App/Models/User"

declare module "@ioc:Adonis/Core/HttpContext" {
  interface HttpContextContract {
    user?: {
      id: string
      roles: Role[]
      userName: string
      firstName: string
      lastName: string
      email: string
    }
  }
}
