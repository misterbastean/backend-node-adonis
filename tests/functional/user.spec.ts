import { test } from "@japa/runner"
import mocks from "Tests/utils/mocks"
import seeds from "Tests/utils/seeds"

let adminToken: string
let userToken: string
const unauthorizedBody = {
  code: 401,
  error: "Unauthorized",
}

test.group("users", () => {
  test("it should fail to authenticate with incorrect credentials", async ({
    client,
  }) => {
    const response = await client.post("/api/v1/login").json({
      data: {
        email: seeds.users[0].email,
        password: "IncorrectPassword",
      },
    })
    response.assertStatus(401)
    response.assertBody({
      code: 401,
      error: "Invalid username or password",
    })
  })

  test("it should successfully authenticate as admin user", async ({
    client,
  }) => {
    const response = await client.post("/api/v1/login").json({
      data: {
        email: seeds.users[1].email,
        password: "Test123!",
      },
    })
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        tokenType: "Bearer",
        expiresIn: 3600,
      },
    })

    adminToken = response.body().data.accessToken
  })

  test("it should successfully authenticate as normal user", async ({
    client,
  }) => {
    const response = await client.post("/api/v1/login").json({
      data: {
        email: seeds.users[0].email,
        password: "Test123!",
      },
    })
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        tokenType: "Bearer",
        expiresIn: 3600,
      },
    })

    userToken = response.body().data.accessToken
  })

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

  test("it should not list all users if not authenticated", async ({
    client,
  }) => {
    const response = await client.get("/api/v1/user")

    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not list all users if authenticated as normal user", async ({
    client,
  }) => {
    const response = await client
      .get("/api/v1/user")
      .header("Authorization", userToken)

    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should list all users if authenticated as admin user", async ({
    client,
  }) => {
    const response = await client
      .get("/api/v1/user")
      .header("Authorization", adminToken)

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

  test("it should not show a single user if unauthenticated", async ({
    client,
  }) => {
    const response = await client.get(`/api/v1/user/${seeds.users[0].id}`)

    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not show a single user if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .get(`/api/v1/user/${seeds.users[1].id}`)
      .header("Authorization", userToken)

    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should get a single user", async ({ client }) => {
    const response = await client
      .get(`/api/v1/user/${seeds.users[0].id}`)
      .header("Authorization", userToken)

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

  test("it should not update a single user if unauthenticated", async ({
    client,
  }) => {
    const updateUserData = {
      email: "updated1@updated.com",
      firstName: "Updated1",
      lastName: "Updated1",
      userName: "updated1",
    }
    const response = await client
      .put(`/api/v1/user/${seeds.users[0].id}`)
      .json({ data: updateUserData })

    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not update a single user if authenticated as another normal user", async ({
    client,
  }) => {
    const updateUserData = {
      email: "updated2@updated.com",
      firstName: "Updated2",
      lastName: "Updated2",
      userName: "updated2",
    }
    const response = await client
      .put(`/api/v1/user/${seeds.users[1].id}`)
      .header("Authorization", userToken)
      .json({ data: updateUserData })

    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
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
      .header("Authorization", userToken)
      .json({ data: updateUserData })

    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        ...updateUserData,
      },
    })
  })

  test("it should not mark a user as deleted if unauthenticated", async ({
    client,
  }) => {
    const response = await client.delete(`/api/v1/user/${seeds.users[1].id}`)

    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not mark a user as deleted if authenticated with another normal user", async ({
    client,
  }) => {
    const response = await client
      .delete(`/api/v1/user/${seeds.users[1].id}`)
      .header("Authorization", userToken)

    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should mark a user as deleted with the current timestamp", async ({
    client,
  }) => {
    const response = await client
      .delete(`/api/v1/user/${seeds.users[0].id}`)
      .header("Authorization", userToken)

    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.users[0].id,
      },
    })
  })
})
