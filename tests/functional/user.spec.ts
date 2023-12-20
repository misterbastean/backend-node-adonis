import { test } from "@japa/runner"
import { mocks, seeds } from "Tests/utils/mocks"

test.group("users", () => {
  test("it should create a user", async ({ client }) => {
    const response = await client.post("/api/v1/user").json({
      data: mocks.user,
    })

    response.assertAgainstApiSpec()
    response.assertStatus(201)
    response.assertBodyContains({
      code: 201,
      data: {},
    })
  })

  test("it should list all users", async ({ client }) => {
    const response = await client.get("/api/v1/user")
    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: [
        {
          id: seeds.user.id,
          email: seeds.user.email,
          firstName: seeds.user.first_name,
          lastName: seeds.user.last_name,
          userName: seeds.user.user_name,
          deletedAt: seeds.user.deleted_at,
        },
      ],
    })
  })

  test("it should get a single user", async ({ client }) => {
    const response = await client.get(`/api/v1/user/${seeds.user.id}`)
    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        id: seeds.user.id,
        email: seeds.user.email,
        firstName: seeds.user.first_name,
        lastName: seeds.user.last_name,
        userName: seeds.user.user_name,
        deletedAt: seeds.user.deleted_at,
      },
    })
  })

  test("it should update a single user", async ({ client }) => {
    const updateUserData = {
      email: "updated@updated.com",
      firstName: "Updated",
      lastName: "Updated",
      userName: "updated",
    }
    const response = await client
      .put(`/api/v1/user/${seeds.user.id}`)
      .json({ data: updateUserData })
    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.user.id,
      },
    })
  })

  test("it should mark a user as deleted with the current timestamp", async ({
    client,
  }) => {
    const response = await client.delete(`/api/v1/user/${seeds.user.id}`)

    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.user.id,
      },
    })
  })
})
