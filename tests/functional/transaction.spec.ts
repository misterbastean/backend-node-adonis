import { test } from "@japa/runner"
import mocks from "Tests/utils/mocks"
import seeds from "Tests/utils/seeds"

test.group("transactions", () => {
  test("it should create a new transaction", async ({ client }) => {
    const response = await client
      .post(`/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}`)
      .json({ data: mocks.transaction })
    response.assertStatus(201)
    response.assertBodyContains({
      code: 201,
      data: { ...mocks.transaction },
    })
  })

  test("it should list all transactions for a single account", async ({
    client,
  }) => {
    const response = await client.get(
      `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}`,
    )
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: [
        {
          userId: seeds.users[0].id,
          accountId: seeds.accounts[0].id,
        },
      ],
    })
  })

  test("it should get a single transaction", async ({ client }) => {
    const response = await client.get(
      `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
    )
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        id: seeds.transactions[0].id,
        userId: seeds.users[0].id,
        accountId: seeds.accounts[0].id,
      },
    })
  })

  test("it should update a single transaction", async ({ client }) => {
    const updateTransactionData = {
      accountId: "100009",
      amount: 200,
      merchant: "Updated Merchant",
      operation: "debit",
      status: "complete",
      transactionTypeId: seeds.transactionTypes[0].id,
    }
    const response = await client
      .put(
        `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
      )
      .json({
        data: updateTransactionData,
        userId: seeds.users[0].id,
      })
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        ...updateTransactionData,
      },
    })
  })

  test("it should mark an account as deleted with the current timestamp", async ({
    client,
  }) => {
    const response = await client.delete(
      `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[8].id}`,
    )
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.transactions[8].id,
      },
    })
  })
})
