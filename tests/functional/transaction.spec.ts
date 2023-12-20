import { test } from "@japa/runner"
import { mocks, seeds } from "Tests/utils/mocks"

test.group("transactions", () => {
  test("it should create a new transaction", async ({ client }) => {
    const response = await client
      .post(
        `/api/v1/user/${seeds.user.id}/account/${seeds.account.id}/transaction`,
      )
      .json({ data: mocks.transaction })
    response.assertAgainstApiSpec()
    response.assertStatus(201)
    response.assertBodyContains({
      code: 201,
      data: {},
    })
  })

  test("it should list all transactions for a single account", async ({
    client,
  }) => {
    const response = await client.get(
      `/api/v1/user/${seeds.user.id}/account/${seeds.account.id}/transaction`,
    )
    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: [
        {
          userId: seeds.user.id,
          accountId: seeds.account.id,
          deletedAt: null,
        },
      ],
    })
  })

  test("it should get a single transaction", async ({ client }) => {
    const response = await client.get(
      `/api/v1/user/${seeds.user.id}/account/${seeds.account.id}/transaction/${seeds.transaction.id}`,
    )
    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        id: seeds.transaction.id,
        userId: seeds.user.id,
        accountId: seeds.account.id,
        deletedAt: null,
      },
    })
  })

  test("it should update a single transaction", async ({ client }) => {
    const response = await client
      .put(
        `/api/v1/user/${seeds.user.id}/account/${seeds.account.id}/transaction/${seeds.transaction.id}`,
      )
      .json({
        data: {
          amount: 0,
          merchantName: "Updated Merchant",
          status: "closed",
        },
      })
    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.transaction.id,
      },
    })
  })

  test("it should mark an account as deleted with the current timestamp", async ({
    client,
  }) => {
    const response = await client.delete(
      `/api/v1/user/${seeds.user.id}/account/${seeds.account.id}/transaction/${seeds.transaction.id}`,
    )
    response.assertAgainstApiSpec()
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.transaction.id,
      },
    })
  })
})
