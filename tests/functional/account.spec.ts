import { test } from "@japa/runner"
import mocks from "Tests/utils/mocks"
import seeds from "Tests/utils/seeds"

let adminToken: string
let userToken: string
const unauthorizedBody = {
  code: 401,
  error: "Unauthorized",
}

test.group("accounts", () => {
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

  test("it should not create an account if unauthenticated", async ({
    client,
  }) => {
    const response = await client
      .post(`/api/v1/account/${seeds.users[0].id}`)
      .json({ data: mocks.account })
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not create an account if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .post(`/api/v1/account/${seeds.users[1].id}`)
      .header("Authorization", userToken)
      .json({ data: mocks.account })

    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should create an account", async ({ client }) => {
    const response = await client
      .post(`/api/v1/account/${seeds.users[1].id}`)
      .header("Authorization", adminToken)
      .json({ data: mocks.account })

    response.assertStatus(201)
    response.assertBodyContains({
      code: 201,
      data: {
        accountNumber: "2345769324576982345697",
        amount: 100,
        availableAmount: 50,
        accountTypeId: "ffefe82a-d8bd-4eea-92ea-0cd754caf2a3",
        currencyCode: "USD",
        name: "Mock Account",
        routingNumber: 100492832467,
        userId: "37aee2d3-c48e-42f1-8e77-138334147e9b",
      },
    })
  })

  test("it should not list all accounts if unauthenticated", async ({
    client,
  }) => {
    const response = await client.get(`/api/v1/account/${seeds.users[0].id}`)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not list all accounts if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .get(`/api/v1/account/${seeds.users[1].id}`)
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should list all accounts for a single user", async ({ client }) => {
    const response = await client
      .get(`/api/v1/account/${seeds.users[0].id}`)
      .header("Authorization", userToken)
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: [
        {
          id: "a0885eec-f903-41fd-b9fc-084f814ed218",
          userId: "37aee2d3-c48e-42f1-8e77-138334147e9b",
          accountTypeId: "ffefe82a-d8bd-4eea-92ea-0cd754caf2a3",
          name: "Checking with Endava",
          amount: 1000,
          availableAmount: 500,
          accountNumber: "12345678",
          routingNumber: "12345678",
          currencyCode: "USD",
          createdAt: "2023-11-21T12:12:49.301-05:00",
          updatedAt: "2023-11-21T12:12:49.301-05:00",
        },
      ],
    })
  })

  test("it should not get a single account if unauthenticated", async ({
    client,
  }) => {
    const response = await client.get(
      `/api/v1/account/${seeds.users[0].id}/${seeds.accounts[0].id}`,
    )
    response.assertStatus(401)
    response.assertBodyContains(unauthorizedBody)
  })

  test("it should not get a single account if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .get(`/api/v1/account/${seeds.users[1].id}/${seeds.accounts[0].id}`)
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBodyContains(unauthorizedBody)
  })

  test("it should get a single account", async ({ client }) => {
    const response = await client
      .get(`/api/v1/account/${seeds.users[0].id}/${seeds.accounts[0].id}`)
      .header("Authorization", userToken)
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        id: seeds.accounts[0].id,
      },
    })
  })

  test("it should not update an account if unauthenticated", async ({
    client,
  }) => {
    const updateAccountData = {
      accountNumber: 11111,
      amount: 222,
      availableAmount: 333,
      accountTypeId: seeds.accountTypes[0].id,
      currencyCode: "WAT",
      name: "Updated",
      routingNumber: 55555,
    }

    const response = await client
      .put(`/api/v1/account/${seeds.users[0].id}/${seeds.accounts[0].id}`)
      .json({
        data: updateAccountData,
      })

    response.assertStatus(401)
    response.assertBodyContains(unauthorizedBody)
  })

  test("it should not update an account if authenticated as another normal user", async ({
    client,
  }) => {
    const updateAccountData = {
      accountNumber: 11111,
      amount: 222,
      availableAmount: 333,
      accountTypeId: seeds.accountTypes[0].id,
      currencyCode: "WAT",
      name: "Updated",
      routingNumber: 55555,
    }

    const response = await client
      .put(`/api/v1/account/${seeds.users[1].id}/${seeds.accounts[0].id}`)
      .json({
        data: updateAccountData,
      })
      .header("Authorization", userToken)

    response.assertStatus(401)
    response.assertBodyContains(unauthorizedBody)
  })

  test("it should update an account", async ({ client }) => {
    const updateAccountData = {
      accountNumber: 11111,
      amount: 222,
      availableAmount: 333,
      accountTypeId: seeds.accountTypes[0].id,
      currencyCode: "WAT",
      name: "Updated",
      routingNumber: 55555,
    }

    const response = await client
      .put(`/api/v1/account/${seeds.users[0].id}/${seeds.accounts[0].id}`)
      .json({
        data: updateAccountData,
      })
      .header("Authorization", userToken)

    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        ...updateAccountData,
      },
    })
  })

  test("it should not mark an account as deleted if unauthenticated", async ({
    client,
  }) => {
    const response = await client.delete(
      `/api/v1/account/${seeds.users[0].id}/${seeds.accounts[2].id}`,
    )
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not mark an account as deleted if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .delete(`/api/v1/account/${seeds.users[1].id}/${seeds.accounts[2].id}`)
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should mark an account as deleted", async ({ client }) => {
    const response = await client
      .delete(`/api/v1/account/${seeds.users[0].id}/${seeds.accounts[2].id}`)
      .header("Authorization", userToken)
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.accounts[2].id,
      },
    })
  })
})
