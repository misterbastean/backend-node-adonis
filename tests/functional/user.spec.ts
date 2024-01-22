import { test } from "@japa/runner"
import mocks from "Tests/utils/mocks"
import seeds from "Tests/utils/seeds"

test.group("users", () => {
  test("it should create a user", async ({ client }) => {
    const response = await client.post("/api/v1/user").json({
      data: mocks.user,
    })

    response.assertStatus(201)
    response.assertBodyContains({
      code: 201,
      data: {
        ...mocks.user,
        password: undefined,
      },
    })
  })

  test("it should list all users", async ({ client }) => {
    const response = await client.get("/api/v1/user")

    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: [
        {
          id: seeds.users[0].id,
          email: seeds.users[0].email,
          firstName: seeds.users[0].first_name,
          lastName: seeds.users[0].last_name,
          userName: seeds.users[0].user_name,
        },
      ],
    })
  })

  test("it should get a single user", async ({ client }) => {
    const response = await client.get(`/api/v1/user/${seeds.users[0].id}`)

    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        id: seeds.users[0].id,
        email: seeds.users[0].email,
        firstName: seeds.users[0].first_name,
        lastName: seeds.users[0].last_name,
        userName: seeds.users[0].user_name,
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
      .put(`/api/v1/user/${seeds.users[0].id}`)
      .json({ data: updateUserData })

    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        ...updateUserData,
      },
    })
  })

  test("it should mark a user as deleted with the current timestamp", async ({
    client,
  }) => {
    const response = await client.delete(`/api/v1/user/${seeds.users[1].id}`)

    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.users[1].id,
      },
    })
  })
})
