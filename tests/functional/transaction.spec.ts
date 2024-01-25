import { test } from "@japa/runner"
import mocks from "Tests/utils/mocks"
import seeds from "Tests/utils/seeds"

let userToken: string
const unauthorizedBody = {
  code: 401,
  error: "Unauthorized",
}

test.group("transactions", () => {
  test("it should successfully authenticate as normal user", async ({
    client,
  }) => {
    const response = await client.post("/api/v1/auth/login").json({
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

  test("it should not create a new transaction if unauthenticated", async ({
    client,
  }) => {
    const response = await client
      .post(`/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}`)
      .json({ data: mocks.transaction })

    response.assertStatus(401)
    response.assertBodyContains(unauthorizedBody)
  })

  test("it should not create a new transaction if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .post(`/api/v1/transaction/${seeds.users[1].id}/${seeds.accounts[0].id}`)
      .json({ data: mocks.transaction })
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should create a new transaction", async ({ client }) => {
    const response = await client
      .post(`/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}`)
      .json({ data: mocks.transaction })
      .header("Authorization", userToken)
    response.assertStatus(201)
    response.assertBodyContains({
      code: 201,
      data: { ...mocks.transaction },
    })
  })

  test("it should not list all transactions if unauthenticated", async ({
    client,
  }) => {
    const response = await client.get(
      `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}`,
    )
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not list all transactions if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .get(`/api/v1/transaction/${seeds.users[1].id}/${seeds.accounts[0].id}`)
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should list all transactions for a single account", async ({
    client,
  }) => {
    const response = await client
      .get(`/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}`)
      .header("Authorization", userToken)
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

  test("it should not get a transaction if unauthenticated", async ({
    client,
  }) => {
    const response = await client.get(
      `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
    )
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not get a transaction if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .get(
        `/api/v1/transaction/${seeds.users[1].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
      )
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should get a single transaction", async ({ client }) => {
    const response = await client
      .get(
        `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
      )
      .header("Authorization", userToken)
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

  test("it should not update a transaction if unauthenticated", async ({
    client,
  }) => {
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
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not update a transaction if authenticated as another normal user", async ({
    client,
  }) => {
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
        `/api/v1/transaction/${seeds.users[1].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
      )
      .json({
        data: updateTransactionData,
        userId: seeds.users[0].id,
      })
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
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
      .header("Authorization", userToken)
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        ...updateTransactionData,
      },
    })
  })

  test("it should not mark an account as deleted if unauthenticated", async ({
    client,
  }) => {
    const response = await client.delete(
      `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[8].id}`,
    )
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not mark an account as deleted if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .delete(
        `/api/v1/transaction/${seeds.users[1].id}/${seeds.accounts[0].id}/${seeds.transactions[8].id}`,
      )
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should mark an account as deleted with the current timestamp", async ({
    client,
  }) => {
    const response = await client
      .delete(
        `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[8].id}`,
      )
      .header("Authorization", userToken)
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.transactions[8].id,
      },
    })
  })
})
