import Env from "@ioc:Adonis/Core/Env"
import { test } from "@japa/runner"
import jwt from "jsonwebtoken"
import { createBearerToken } from "App/Utils"
import { User } from "App/Models"

test.group("Auth", () => {
  const JWT_SECRET = Env.get("JWT_SECRET")
  const mockUser = {
    $attributes: {
      id: "123",
      userName: "mockUser",
      firstName: "Mock",
      lastName: "User",
      role: "user",
      email: "mock@mock.com",
    },
  } as unknown as User

  test("createBearerToken creates proper JWT", async ({ assert }) => {
    const bearerToken = await createBearerToken(mockUser)
    const decodedToken = await jwt.verify(bearerToken, JWT_SECRET)

    const expected = {
      iss: "Endava",
      sub: mockUser.$attributes.id,
      user: {
        userName: mockUser.$attributes.userName,
        firstName: mockUser.$attributes.firstName,
        lastName: mockUser.$attributes.lastName,
        email: mockUser.$attributes.email,
      },
      roles: ["user"],
    }

    assert.deepInclude(decodedToken, expected)
  })
})
