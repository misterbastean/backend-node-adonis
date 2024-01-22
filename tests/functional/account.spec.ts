import { test } from "@japa/runner"
import mocks from "Tests/utils/mocks"
import seeds from "Tests/utils/seeds"

test.group("accounts", () => {
  test("it should create an account", async ({ client }) => {
    const response = await client
      .post(`/api/v1/account/${seeds.users[0].id}`)
      .json({ data: mocks.account })

    response.assertStatus(201)
    response.assertBodyContains({
      code: 201,
      data: { ...mocks.account },
    })
  })

  test("it should list all accounts for a single user", async ({ client }) => {
    const response = await client.get(`/api/v1/account/${seeds.users[0].id}`)
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

  test("it should get a single account", async ({ client }) => {
    const response = await client.get(
      `/api/v1/account/${seeds.users[0].id}/${seeds.accounts[0].id}`,
    )
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        id: seeds.accounts[0].id,
      },
    })
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

    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        ...updateAccountData,
      },
    })
  })

  test("it should mark an account as deleted", async ({ client }) => {
    const response = await client.delete(
      `/api/v1/account/${seeds.users[0].id}/${seeds.accounts[2].id}`,
    )
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.accounts[2].id,
      },
    })
  })
})
