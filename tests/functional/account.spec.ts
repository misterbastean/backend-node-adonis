import { test } from "@japa/runner"
import { mocks, seeds } from "Tests/utils/mocks"

test.group("accounts", () => {
  test("it should create an account", async ({ client }) => {
    const response = await client
      .post(`/api/v1/user/${seeds.user.id}/account`)
      .json({ data: mocks.account })

    response.assertAgainstApiSpec()
    response.assertStatus(201)
    response.assertBodyContains({
      code: 201,
      data: {},
    })
  })

  test("it should list all accounts for a single user", async ({ client }) => {
    const response = await client.get(`/api/v1/user/${seeds.user.id}/account`)
    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: [{ deletedAt: null }],
    })
  })

  test("it should get a single account", async ({ client }) => {
    const response = await client.get(
      `/api/v1/user/${seeds.user.id}/account/${seeds.account.id}`,
    )
    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        id: seeds.account.id,
        deletedAt: null,
      },
    })
  })

  test("it should update an account", async ({ client }) => {
    const response = await client
      .put(`/api/v1/user/${seeds.user.id}/account/${seeds.account.id}`)
      .json({
        data: {
          accountNumber: 11111,
          amount: 222,
          availableAmount: 333,
          categoryId: "739e94cb-0c71-4557-83d1-b30c8f705c67",
          currencyCode: "WAT",
          name: "Updated",
          routingNumber: 55555,
        },
      })

    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.account.id,
      },
    })
  })

  test("it should mark an account as deleted with the current timestamp", async ({
    client,
  }) => {
    const response = await client.delete(
      `/api/v1/user/${seeds.user.id}/account/${seeds.account.id}`,
    )
    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.account.id,
      },
    })
  })
})
