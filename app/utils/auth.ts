import Env from "@ioc:Adonis/Core/Env"
import { User } from "App/Models"
import jwt from "jsonwebtoken"

const JWT_ISSUER = Env.get("JWT_ISSUER")
const JWT_SECRET = Env.get("JWT_SECRET")

async function createBearerToken(user: User) {
  const payload = {
    iss: JWT_ISSUER,
    sub: user.$attributes.id,
    user: {
      userName: user.$attributes.userName,
      firstName: user.$attributes.firstName,
      lastName: user.$attributes.lastName,
      email: user.$attributes.email,
    },
    roles: [user.$attributes.role],
  }
  const token = await jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  })
  return token
}

export { createBearerToken }
