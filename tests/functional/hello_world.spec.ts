import { test } from "@japa/runner"

test("display welcome page", async ({ client }) => {
  const response = await client.get("/")

  response.assertStatus(404)
})

test.group("users", () => {
  test("list users", async ({ client }) => {
    const response = await client.get("/api/v1/user")

    response.assertAgainstApiSpec()
  })
})
